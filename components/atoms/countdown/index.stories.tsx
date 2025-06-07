import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import Countdown from './countdown'

/**
 * Component đồng hồ đếm ngược không có vòng tròn tiến trình,
 * có tính năng chớp nháy trong 10 giây cuối
 */
const meta: Meta<typeof Countdown> = {
  title: 'Atoms/Countdown',
  component: Countdown,
  tags: ['autodocs'],
  argTypes: {
    timerEnd: {
      control: 'text',
      description: 'Thời gian kết thúc dạng ISO hoặc DD/MM/YYYY',
    },
    onFinish: {
      action: 'Hết giờ!',
      description: 'Hàm được gọi khi hết thời gian',
    },
    textColor: {
      control: 'color',
      description: 'Màu chữ mặc định',
    },
    fontSize: {
      control: 'text',
      description: 'Kích thước chữ (px, rem hoặc em)',
    },
    animationTimerEnd: {
      control: 'boolean',
      description: 'Bật/tắt hiệu ứng chớp nháy trong 10 giây cuối',
    },
    animationColor: {
      control: 'color',
      description: 'Màu chữ khi nhấp nháy trong 10 giây cuối',
    },
    timeZoneOffset: {
      control: 'number',
      description: 'Offset múi giờ (ví dụ: 7 cho GMT+7 - Việt Nam)',
    },
  },
}

export default meta
type Story = StoryObj<typeof Countdown>

/**
 * Hàm tạo ngày trong tương lai dựa trên số phút
 * @param minutes Số phút từ thời điểm hiện tại
 * @returns Chuỗi ISO cho thời gian trong tương lai
 */
const getFutureTime = (minutes: number): string => {
  const date = new Date()
  date.setMinutes(date.getMinutes() + minutes)
  return date.toISOString()
}

/**
 * Decorator để đảm bảo đồng hồ đếm ngược sẽ luôn hiển thị đúng thời gian
 */
const CountdownWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [key, setKey] = React.useState(Date.now())

  // Force re-render khi component được mount
  React.useEffect(() => {
    // Tạo key mới để re-render countdown
    setKey(Date.now())
  }, [])

  return <div key={key}>{children}</div>
}

/**
 * Đồng hồ đếm ngược mặc định với 5 phút
 */
export const Default: Story = {
  args: {
    timerEnd: getFutureTime(5),
    fontSize: '1.5rem',
    textColor: '#333333',
  },
  decorators: [
    (Story) => (
      <CountdownWrapper>
        <Story />
      </CountdownWrapper>
    ),
  ],
}

/**
 * Đồng hồ đếm ngược với hiệu ứng chớp nháy trong 10 giây cuối
 * Sử dụng 20 giây từ thời điểm hiện tại để dễ quan sát
 */
export const WithBlinkingAnimation: Story = {
  args: {
    timerEnd: getFutureTime(1 / 3), // 20 giây từ hiện tại
    fontSize: '1.5rem',
    textColor: '#333333',
    animationTimerEnd: true,
    animationColor: '#FF5A5A',
  },
  decorators: [
    (Story) => (
      <CountdownWrapper>
        <Story />
      </CountdownWrapper>
    ),
  ],
  parameters: {
    chromatic: { disableSnapshot: true },
  },
}

/**
 * Đồng hồ đếm ngược với kích thước chữ lớn
 */
export const LargeSize: Story = {
  args: {
    timerEnd: getFutureTime(10),
    fontSize: '2.5rem',
    textColor: '#2563EB',
    animationTimerEnd: true,
    animationColor: '#FF0000',
  },
  decorators: [
    (Story) => (
      <CountdownWrapper>
        <Story />
      </CountdownWrapper>
    ),
  ],
}

/**
 * Đồng hồ với thời gian đã kết thúc
 */
export const AlreadyFinished: Story = {
  args: {
    timerEnd: getFutureTime(-5), // 5 phút trước
    fontSize: '1.5rem',
    textColor: '#888888',
  },
}

/**
 * Đồng hồ với định dạng ngày DD/MM/YYYY
 * Lưu ý: Sử dụng ngày trong tương lai không xa
 */
export const WithDateFormat: Story = {
  args: {
    // Tạo ngày trong tương lai với định dạng DD/MM/YYYY
    timerEnd: (() => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      return `${String(tomorrow.getDate()).padStart(2, '0')}/${String(
        tomorrow.getMonth() + 1,
      ).padStart(2, '0')}/${tomorrow.getFullYear()}`
    })(),
    fontSize: '1.5rem',
    textColor: '#333333',
    animationTimerEnd: true,
  },
}

/**
 * Đồng hồ đếm ngược với màu sắc tùy chỉnh
 */
export const CustomColors: Story = {
  args: {
    timerEnd: getFutureTime(3),
    fontSize: '2rem',
    textColor: '#6D28D9',
    animationTimerEnd: true,
    animationColor: '#DC2626',
  },
  decorators: [
    (Story) => (
      <CountdownWrapper>
        <Story />
      </CountdownWrapper>
    ),
  ],
}

/**
 * Đồng hồ đếm ngược ở chính xác 10 giây (ngưỡng bắt đầu hiệu ứng)
 */
export const ExactlyTenSeconds: Story = {
  args: {
    timerEnd: getFutureTime(10 / 60), // 10 giây từ hiện tại
    fontSize: '2rem',
    textColor: '#333333',
    animationTimerEnd: true,
    animationColor: '#FF0000',
  },
  decorators: [
    (Story) => (
      <CountdownWrapper>
        <Story />
      </CountdownWrapper>
    ),
  ],
  parameters: {
    chromatic: { disableSnapshot: true },
  },
}

/**
 * Đồng hồ đếm ngược sử dụng múi giờ Việt Nam (GMT+7)
 */
export const WithVietnamTimeZone: Story = {
  args: {
    // Sử dụng thời gian 5 phút trong tương lai, nhưng hiển thị theo GMT+7
    timerEnd: getFutureTime(5),
    fontSize: '1.5rem',
    textColor: '#333333',
    timeZoneOffset: 7, // Múi giờ Việt Nam (GMT+7)
    animationTimerEnd: true,
  },
  decorators: [
    (Story) => (
      <CountdownWrapper>
        <Story />
      </CountdownWrapper>
    ),
  ],
}
