import { useState, useEffect, useRef } from 'react'

function App() {
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false)
      setIsCompleted(true)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  const startTimer = () => {
    const totalSeconds = minutes * 60 + seconds
    if (totalSeconds > 0) {
      setTimeLeft(totalSeconds)
      setIsRunning(true)
      setIsCompleted(false)
    }
  }

  const stopTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(0)
    setIsCompleted(false)
  }

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getCircleProgress = () => {
    const totalTime = minutes * 60 + seconds
    if (totalTime === 0) return 0
    return ((totalTime - timeLeft) / totalTime) * 100
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white text-center">カウントダウンタイマー</h1>
          </div>
          
          <div className="p-6">
            {!isRunning && timeLeft === 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">分</label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={minutes}
                      onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">秒</label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={seconds}
                      onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg"
                    />
                  </div>
                </div>
                
                <button
                  onClick={startTimer}
                  disabled={minutes === 0 && seconds === 0}
                  className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium text-lg"
                >
                  スタート
                </button>
              </div>
            )}

            {(isRunning || timeLeft > 0) && (
              <div className="space-y-6">
                <div className="flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke={isCompleted ? "#ef4444" : "#3b82f6"}
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={283}
                        strokeDashoffset={283 - (283 * getCircleProgress()) / 100}
                        className="transition-all duration-1000 ease-linear"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-4xl font-bold ${isCompleted ? 'text-red-500' : 'text-gray-700'}`}>
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  {isRunning ? (
                    <button
                      onClick={stopTimer}
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
                    >
                      ストップ
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsRunning(true)}
                      disabled={timeLeft === 0}
                      className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                    >
                      再開
                    </button>
                  )}
                  <button
                    onClick={resetTimer}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
                  >
                    リセット
                  </button>
                </div>
              </div>
            )}

            {isCompleted && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
                <p className="font-semibold">時間になりました！</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
