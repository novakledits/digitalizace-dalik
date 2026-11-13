import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

const KEY = 'ai-od-nuly-do-sta'

type Ctx = { done: Record<string, 1>; mark: (id: string) => void; reset: () => void }
const C = createContext<Ctx>({ done: {}, mark: () => {}, reset: () => {} })

function load(): Record<string, 1> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}') || {}
  } catch {
    return {}
  }
}
function save(v: Record<string, 1>) {
  try {
    localStorage.setItem(KEY, JSON.stringify(v))
  } catch {
    /* úložiště nemusí být dostupné */
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [done, setDone] = useState<Record<string, 1>>(load)
  const mark = useCallback((id: string) => {
    setDone((d) => {
      if (d[id]) return d
      const n = { ...d, [id]: 1 as const }
      save(n)
      return n
    })
  }, [])
  const reset = useCallback(() => {
    setDone({})
    save({})
  }, [])
  return <C.Provider value={{ done, mark, reset }}>{children}</C.Provider>
}

export const useProgress = () => useContext(C)
