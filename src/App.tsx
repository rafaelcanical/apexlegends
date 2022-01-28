import { useEffect, useState } from 'react'

type Map = {
  code?: string
  start?: number
  end?: number
  map: string
  remainingMins?: number
  remainingSecs?: number
  remainingTimer?: string
}

function App() {
  // Local state
  const [loaded, setLoaded] = useState(false)
  const [rerender, setRerender] = useState(false)
  const [reload, setReload] = useState(false)
  const [current, setCurrent] = useState<Map>()
  const [next, setNext] = useState<Map>()
  const [ranked, setRanked] = useState<Map>()
  const [currentArenas, setCurrentArenas] = useState<Map>()
  const [nextArenas, setNextArenas] = useState<Map>()
  const [currentRankedArenas, setCurrentRankedArenas] = useState<Map>()
  const [nextRankedArenas, setNextRankedArenas] = useState<Map>()

  // Triggered after the first render
  useEffect(() => {
    fetch('https://api.mozambiquehe.re/maprotation?version=5&auth=CYlpQYEwI2Y01EJXdYDY')
      .then((resp) => resp.json())
      .then((data) => {
        const { battle_royale: br, ranked, arenas, arenasRanked } = data

        // Battle Royale
        setCurrent(br.current)
        setNext(br.next)
        setRanked(ranked.current)

        // Arenas
        setCurrentArenas(arenas.current)
        setNextArenas(arenas.next)
        setCurrentRankedArenas(arenasRanked.current)
        setNextRankedArenas(arenasRanked.next)

        // Give some time to load everything
        setTimeout(() => {
          setLoaded(true)
        }, 300)
      })
  }, [reload])

  // Trigger after each render (here we force rerender every second)
  useEffect(() => {
    const timer = setTimeout(() => {
      setRerender(!rerender)

      if (
        _calculateTimeLeft(current?.end) === '00:00:00' ||
        _calculateTimeLeft(currentArenas?.end) === '00:00:00' ||
        _calculateTimeLeft(currentRankedArenas?.end) === '00:00:00'
      ) {
        setLoaded(false)
        setReload(!reload)
      }
    }, 1000)

    return () => clearTimeout(timer)
  })

  /**
   * Calculate time left
   */
  const _calculateTimeLeft = (time: number | undefined) => {
    if (time != null) {
      // Time in seconds minus (current time in seconds) plus 4 seconds
      const diffInSeconds = time - Date.now() / 1000 + 4

      const hours = _addLeadingZero(Math.floor((diffInSeconds / (60 * 60)) % 24))
      const minutes = _addLeadingZero(Math.floor((diffInSeconds / 60) % 60))
      const seconds = _addLeadingZero(Math.floor(diffInSeconds % 60))

      return `${hours}:${minutes}:${seconds}`
    }

    return ''
  }

  /**
   * Add leading zero to a number and make it a string
   */
  const _addLeadingZero = (time: number): string => {
    let newTime = '0' + time
    return newTime.slice(-2)
  }

  return (
    <div className="map-lists">
      {rerender ? null : null}
      {loaded ? (
        <>
          {/* Battle Royale Pubs */}
          {current != null && next != null ? (
            <div className="map-row current">
              <div className="subtitle">Battle Royale Pubs</div>
              <div className="title">
                {current.map} <span>{_calculateTimeLeft(current.end)}</span>
              </div>
              <div className="next-map">Next: {next.map}</div>
            </div>
          ) : null}

          {/* Battle Royale Ranked */}
          {ranked != null ? (
            <div className="map-row current">
              <div className="subtitle">Battle Royale Ranked</div>
              <div className="title">{ranked.map}</div>
            </div>
          ) : null}

          {/* Arenas Pubs */}
          {currentArenas != null && nextArenas != null ? (
            <div className="map-row current">
              <div className="subtitle">Arenas Pubs</div>
              <div className="title">
                {currentArenas.map} <span>{_calculateTimeLeft(currentArenas.end)}</span>
              </div>
              <div className="next-map">Next: {nextArenas.map}</div>
            </div>
          ) : null}

          {/* Arenas Ranked */}
          {currentRankedArenas != null && nextRankedArenas != null ? (
            <div className="map-row current">
              <div className="subtitle">Arenas Ranked</div>
              <div className="title">
                {currentRankedArenas.map} <span>{_calculateTimeLeft(currentRankedArenas.end)}</span>
              </div>
              <div className="next-map">Next: {nextRankedArenas.map}</div>
            </div>
          ) : null}
        </>
      ) : (
        <div className="loading">Loading...</div>
      )}
    </div>
  )
}

export default App
