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
  }, [])

  return (
    <div className="map-lists">
      {loaded ? (
        <>
          {/* Battle Royale Pubs */}
          {current != null && next != null ? (
            <div className="map-row current">
              <div className="subtitle">Battle Royale Pubs</div>
              <div className="title">
                {current.map} <span>{current.remainingTimer}</span>
              </div>
              <div className="next-map">Next: {next.map}</div>
            </div>
          ) : null}

          {/* Battle Royale Ranked */}
          {ranked != null ? (
            <div className="map-row current">
              <div className="subtitle">Battle Royale Ranked</div>
              <div className="title">
                {ranked.map} <span>{ranked.remainingTimer}</span>
              </div>
            </div>
          ) : null}

          {/* Arenas Pubs */}
          {currentArenas != null && nextArenas != null ? (
            <div className="map-row current">
              <div className="subtitle">Arenas Pubs</div>
              <div className="title">
                {currentArenas.map} <span>{currentArenas.remainingTimer}</span>
              </div>
              <div className="next-map">Next: {nextArenas.map}</div>
            </div>
          ) : null}

          {/* Arenas Ranked */}
          {currentRankedArenas != null && nextRankedArenas != null ? (
            <div className="map-row current">
              <div className="subtitle">Arenas Ranked</div>
              <div className="title">
                {currentRankedArenas.map} <span>{currentRankedArenas.remainingTimer}</span>
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
