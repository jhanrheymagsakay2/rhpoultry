import { useEffect, useRef, useState } from 'react'

// Common lead-in phrases people say without meaning them literally
// (e.g. "search for whoopie" should search "whoopie", not the whole phrase).
const FILLER_PREFIXES = [
  'search for ',
  'search ',
  'find me ',
  'find ',
  'look for ',
  'looking for ',
  'show me ',
]

function stripFillerWords(text) {
  const lower = text.toLowerCase()
  for (const prefix of FILLER_PREFIXES) {
    if (lower.startsWith(prefix)) {
      return text.slice(prefix.length).trim()
    }
  }
  return text
}

// Some browsers auto-add punctuation to speech transcripts (e.g. a
// trailing "." when it thinks you finished a sentence). Strip it —
// it's noise for search purposes, not something the user actually said.
function stripPunctuation(text) {
  return text.replace(/[.,!?;:]+/g, '').replace(/\s+/g, ' ').trim()
}

// Errors that mean "stop trying" rather than "just retry".
const FATAL_ERRORS = new Set(['not-allowed', 'service-not-allowed'])

// How long we'll tolerate zero activity (no start/result/end event) while
// we believe we should be listening, before assuming the browser silently
// stalled and forcing a fresh restart. This is the fix for "works
// sometimes" — some phones/browsers stop delivering results in continuous
// mode without ever firing onend to tell us it stopped.
const WATCHDOG_TIMEOUT_MS = 8000

// Uses the browser's built-in speech recognition (Web Speech API) — free,
// no API key, no external service. Best support: Chrome/Edge on Android
// and desktop. Safari/iOS support is limited/inconsistent, and Firefox
// doesn't support it at all, so this hook exposes `supported` so the UI
// can hide itself gracefully where it won't work.
export function useContinuousVoiceSearch({ onResult, enabled }) {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(true)
  const [needsPermissionTap, setNeedsPermissionTap] = useState(false)
  const recognitionRef = useRef(null)
  const shouldListenRef = useRef(false)
  const lastActivityRef = useRef(0)
  const restartTimeoutRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setSupported(false)
      return
    }

    const recognition = new SpeechRecognition()
    // continuous=false + restart-on-end (below) is more reliable across
    // phones than continuous=true, which has known bugs on some Android/
    // Chrome builds where it silently stops delivering results.
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = navigator.language || 'en-US'

    // Confidence-based noise filtering: some browsers report 0 for every
    // result (meaning "not measured", not "no confidence"), so we only
    // reject a result when a real, low confidence score comes through —
    // never when confidence is exactly 0 (unmeasured/unreliable to judge).
    const CONFIDENCE_THRESHOLD = 0.3

    const restartSoon = () => {
      clearTimeout(restartTimeoutRef.current)
      restartTimeoutRef.current = setTimeout(() => {
        if (!shouldListenRef.current) return
        try {
          recognition.start()
        } catch {
          // Already starting/started — ignore, watchdog will recover if truly stuck.
        }
      }, 150)
    }

    recognition.onresult = (event) => {
      lastActivityRef.current = Date.now()
      let text = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const { transcript, confidence } = result[0]
        if (result.isFinal && confidence > 0 && confidence < CONFIDENCE_THRESHOLD) {
          continue // likely noise/mumbling, not real speech — skip it
        }
        text += transcript
      }
      if (text.trim()) {
        onResult(stripFillerWords(stripPunctuation(text.trim())))
      }
    }

    recognition.onstart = () => {
      lastActivityRef.current = Date.now()
      setListening(true)
      setNeedsPermissionTap(false)
    }

    recognition.onerror = (event) => {
      lastActivityRef.current = Date.now()
      if (FATAL_ERRORS.has(event.error)) {
        shouldListenRef.current = false
        setListening(false)
        setNeedsPermissionTap(true)
        return
      }
      // 'no-speech' / 'audio-capture' / 'network' / 'aborted' etc. are
      // recoverable — onend fires right after this and restarts us.
    }

    recognition.onend = () => {
      lastActivityRef.current = Date.now()
      setListening(false)
      // Restart to keep the "always listening" feel, since continuous=false
      // naturally stops after each pause.
      if (shouldListenRef.current) restartSoon()
    }

    recognitionRef.current = recognition

    // Watchdog: if we believe we should be listening but haven't heard
    // from the recognizer in a while, it likely stalled silently — force
    // a hard restart to recover instead of staying stuck.
    const watchdog = setInterval(() => {
      if (!shouldListenRef.current) return
      if (Date.now() - lastActivityRef.current > WATCHDOG_TIMEOUT_MS) {
        lastActivityRef.current = Date.now()
        try {
          recognition.stop()
        } catch {
          // Ignore.
        }
        try {
          recognition.abort()
        } catch {
          // Ignore.
        }
        restartSoon()
      }
    }, 3000)

    return () => {
      clearInterval(watchdog)
      clearTimeout(restartTimeoutRef.current)
      shouldListenRef.current = false
      recognition.onresult = null
      recognition.onend = null
      recognition.onerror = null
      recognition.onstart = null
      try {
        recognition.stop()
      } catch {
        // Ignore.
      }
    }
  }, [onResult])

  useEffect(() => {
    if (!supported || !recognitionRef.current) return

    if (enabled) {
      shouldListenRef.current = true
      lastActivityRef.current = Date.now()
      try {
        recognitionRef.current.start()
      } catch {
        // Ignore — e.g. called again before previous instance fully stopped.
      }
    } else {
      shouldListenRef.current = false
      clearTimeout(restartTimeoutRef.current)
      try {
        recognitionRef.current.stop()
      } catch {
        // Ignore.
      }
    }
  }, [enabled, supported])

  const requestPermission = () => {
    if (!recognitionRef.current) return
    shouldListenRef.current = true
    lastActivityRef.current = Date.now()
    try {
      recognitionRef.current.start()
    } catch {
      // Ignore.
    }
  }

  return { listening, supported, needsPermissionTap, requestPermission }
}
