import React, { useEffect, useMemo, useState } from 'react'
import { useCountdown } from './useCountdown'

/**
 * Props cho component đếm ngược
 */
export interface CountdownProps {
  /**
   * Thời gian kết thúc dạng ISO hoặc DD/MM/YYYY
   */
  timerEnd: string

  /**
   * Múi giờ offset (ví dụ: 7 cho GMT+7 - Việt Nam)
   * Mặc định là múi giờ local của trình duyệt
   */
  timeZoneOffset?: number

  /**
   * Hàm được gọi khi hết thời gian đếm ngược
   */
  onFinish?: () => void

  /**
   * Class cho container
   */
  className?: string

  /**
   * Màu cho chữ hiển thị thời gian
   */
  textColor?: string

  /**
   * Kích thước chữ của đồng hồ đếm ngược
   */
  fontSize?: number | string

  /**
   * Bật hiệu ứng chớp nháy trong 10 giây cuối
   */
  animationTimerEnd?: boolean
  /**
   * Màu chữ cho hiệu ứng chớp nháy (mặc định là màu đỏ)
   */
  animationColor?: string
}

/**
 * Component đồng hồ đếm ngược không có vòng tròn tiến trình
 */
const Countdown: React.FC<CountdownProps> = ({
  timerEnd,
  onFinish,
  className = '',
  textColor = '#333333',
  fontSize = '1rem',
  animationTimerEnd = false,
  animationColor = '#FF5A5A',
  timeZoneOffset,
}) => {
  // Hiển thị thông tin debug trong môi trường development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `Countdown: timerEnd=${timerEnd}, timeZoneOffset=${timeZoneOffset}`,
      )
    }
  }, [timerEnd, timeZoneOffset])

  // Lấy dữ liệu đếm ngược từ hook
  const { hours, minutes, seconds, isFinished, totalSeconds } = useCountdown(
    timerEnd,
    onFinish,
    timeZoneOffset,
  )

  // State để kiểm soát hiệu ứng nhấp nháy (hiển thị/ẩn)
  const [visible, setVisible] = useState(true)
  // Chạy hiệu ứng chớp nháy khi còn 10 giây cuối
  useEffect(() => {
    if (!animationTimerEnd) return

    let blinkInterval: NodeJS.Timeout | null = null
    if (totalSeconds <= 10 && totalSeconds > 0) {
      blinkInterval = setInterval(() => {
        setVisible((prev) => !prev)
      }, 300) // Giảm thời gian xuống 300ms để tạo hiệu ứng nhanh hơn
    } else {
      setVisible(true)
    }
    return () => {
      if (blinkInterval) clearInterval(blinkInterval)
    }
  }, [totalSeconds, animationTimerEnd])

  // Định dạng giá trị thời gian luôn có 2 chữ số
  const formattedTime = useMemo(() => {
    if (hours > 0) {
      // Khi có giờ: Hiển thị tổng số giờ (không giới hạn 2 chữ số) + phút + giây
      const totalHours = hours
      const formattedHours = totalHours.toString()
      const formattedMinutes = minutes.toString().padStart(2, '0')
      const formattedSeconds = seconds.toString().padStart(2, '0')
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
    } else {
      // Khi không có giờ: Hiển thị phút + giây
      const formattedMinutes = minutes.toString().padStart(2, '0')
      const formattedSeconds = seconds.toString().padStart(2, '0')
      return `${formattedMinutes}:${formattedSeconds}`
    }
  }, [hours, minutes, seconds])

  // Tính toán màu chữ dựa trên hiệu ứng chớp nháy
  const currentTextColor = useMemo(() => {
    if (
      animationTimerEnd &&
      totalSeconds <= 10 &&
      totalSeconds > 0 &&
      !isFinished
    ) {
      return animationColor
    }
    return textColor
  }, [animationTimerEnd, totalSeconds, textColor, animationColor, isFinished])

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      {/* Hiển thị thời gian dạng text */}{' '}
      <div
        className='font-medium transition-colors duration-200'
        style={{
          color: currentTextColor,
          fontSize: fontSize,
          opacity:
            animationTimerEnd &&
            totalSeconds <= 10 &&
            totalSeconds > 0 &&
            !isFinished
              ? visible
                ? 1
                : 0
              : 1,
          transition: 'opacity 0.1s, color 0.2s', // Giảm transition time cho opacity để phù hợp với tốc độ chớp nháy nhanh hơn
        }}
      >
        {isFinished ? '00:00' : formattedTime}
      </div>
    </div>
  )
}

export default Countdown
