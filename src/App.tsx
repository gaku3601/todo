import { useState, useEffect, useRef } from 'react'

interface TimerPreset {
  id: string;
  name: string;
  minutes: number;
  seconds: number;
}

function App() {
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [presets, setPresets] = useState<TimerPreset[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Load presets from localStorage on component mount
  useEffect(() => {
    const savedPresets = localStorage.getItem('timerPresets')
    if (savedPresets) {
      setPresets(JSON.parse(savedPresets))
    }
  }, [])

  // Save presets to localStorage whenever presets change
  useEffect(() => {
    localStorage.setItem('timerPresets', JSON.stringify(presets))
  }, [presets])

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

  const savePreset = () => {
    if (minutes > 0 || seconds > 0) {
      const name = `${minutes}分 ${seconds}秒`
      const newPreset: TimerPreset = {
        id: Date.now().toString(),
        name,
        minutes,
        seconds
      }
      setPresets([...presets, newPreset])
    }
  }

  const loadPreset = (preset: TimerPreset) => {
    setMinutes(preset.minutes)
    setSeconds(preset.seconds)
    setTimeLeft(0)
    setIsRunning(false)
    setIsCompleted(false)
  }

  const deletePreset = (id: string) => {
    setPresets(presets.filter(preset => preset.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="px-8 py-6 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">カウントダウン</h1>
            <p className="text-gray-600">時間を設定してスタートしよう</p>
          </div>
          
          <div className="px-8 pb-8">
            {!isRunning && timeLeft === 0 && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <label className="block text-sm font-semibold text-gray-600 mb-3">分</label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={minutes}
                      onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full h-16 px-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-0 focus:border-purple-400 text-center text-2xl font-bold text-gray-800 transition-all duration-200"
                    />
                  </div>
                  <div className="text-center">
                    <label className="block text-sm font-semibold text-gray-600 mb-3">秒</label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={seconds}
                      onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                      className="w-full h-16 px-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-0 focus:border-purple-400 text-center text-2xl font-bold text-gray-800 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Save Timer Button */}
                <div className="flex gap-3">
                  <button
                    onClick={startTimer}
                    disabled={minutes === 0 && seconds === 0}
                    className="flex-1 h-14 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    スタート
                  </button>
                  <button
                    onClick={savePreset}
                    disabled={minutes === 0 && seconds === 0}
                    className="h-14 px-4 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    💾
                  </button>
                </div>

                {/* Saved Presets */}
                {presets.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-600">保存されたプリセット</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {presets.map((preset) => (
                        <div
                          key={preset.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 group"
                        >
                          <button
                            onClick={() => loadPreset(preset)}
                            className="flex-1 text-left"
                          >
                            <div className="font-medium text-gray-800">{preset.name}</div>
                            <div className="text-sm text-gray-500">
                              {preset.minutes}分 {preset.seconds}秒
                            </div>
                          </button>
                          <button
                            onClick={() => deletePreset(preset.id)}
                            className="opacity-0 group-hover:opacity-100 ml-2 px-2 py-1 text-red-500 hover:text-red-700 transition-all duration-200"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {(isRunning || timeLeft > 0) && (
              <div className="space-y-8">
                <div className="flex items-center justify-center">
                  <div className="relative w-64 h-64">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="#f3f4f6"
                        strokeWidth="6"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="url(#gradient)"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={283}
                        strokeDashoffset={283 - (283 * getCircleProgress()) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-linear"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={isCompleted ? "#ef4444" : "#a855f7"} />
                          <stop offset="100%" stopColor={isCompleted ? "#dc2626" : "#ec4899"} />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className={`text-5xl font-bold ${isCompleted ? 'text-red-500' : 'text-gray-800'}`}>
                          {formatTime(timeLeft)}
                        </span>
                        <p className="text-sm text-gray-500 mt-2">残り時間</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  {isRunning ? (
                    <button
                      onClick={stopTimer}
                      className="flex-1 h-12 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      ⏸ ストップ
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsRunning(true)}
                      disabled={timeLeft === 0}
                      className="flex-1 h-12 bg-green-500 text-white rounded-2xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      ▶ 再開
                    </button>
                  )}
                  <button
                    onClick={resetTimer}
                    className="flex-1 h-12 bg-gray-400 text-white rounded-2xl hover:bg-gray-500 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    🔄 リセット
                  </button>
                </div>
              </div>
            )}

            {isCompleted && (
              <div className="mt-6 p-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-700 rounded-2xl text-center shadow-lg relative">
                <button
                  onClick={() => setIsCompleted(false)}
                  className="absolute top-3 right-3 w-8 h-8 bg-red-200 hover:bg-red-300 text-red-600 rounded-full flex items-center justify-center transition-colors duration-200 text-sm font-bold"
                >
                  ✕
                </button>
                <div className="text-4xl mb-2">🎉</div>
                <p className="font-bold text-lg">時間になりました！</p>
                <p className="text-sm text-red-600 mt-1">お疲れさまでした</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
