# 🎌 Japanese Learning App - Thể Thường (普通形)

Ứng dụng học tiếng Nhật hiện đại với giao diện đẹp mắt, tập trung vào việc luyện tập chuyển đổi từ thể lịch sự sang thể thường.

## ✨ Tính Năng Chính

### 🎯 Học Tập
- **Lý thuyết chi tiết** với sơ đồ tư duy trực quan
- **16+ loại bài tập** từ cơ bản đến nâng cao
- **Chế độ ôn tập** câu sai để học hiệu quả
- **Feedback chi tiết** với giải thích

### 📊 Theo Dõi Tiến Độ
- **Thống kê chi tiết** theo thời gian
- **Achievement system** với các thành tựu
- **Progress tracking** cho từng bài tập
- **Lịch sử học tập** đầy đủ

### 🎨 Giao Diện
- **Dark/Light mode** tự động
- **Responsive design** trên mọi thiết bị
- **Tailwind CSS** cho styling hiện đại
- **Smooth animations** và transitions

### ⚡ Performance
- **Modular architecture** dễ maintain
- **Local storage** cho offline usage
- **Fast loading** với lazy loading
- **PWA ready** (có thể mở rộng)

## 🏗️ Cấu Trúc Project

```
japanese-learning-app/
├── index.html                      # HTML chính (Tailwind CSS)
├── questions.json                  # Dữ liệu câu hỏi
├── answers.json                   # Dữ liệu đáp án
├── package.json                   # Dependencies & scripts
├── README.md                      # Hướng dẫn này
├── 
├── assets/
│   └── js/
│       ├── app.js                 # JavaScript chính
│       ├── modules/               # Core modules
│       │   ├── data-loader.js     # Load dữ liệu JSON
│       │   ├── quiz-manager.js    # Quản lý quiz
│       │   ├── stats-manager.js   # Quản lý thống kê
│       │   ├── storage-manager.js # Local storage
│       │   ├── theme-manager.js   # Dark/light mode
│       │   └── navigation.js      # Routing & navigation
│       ├── components/            # UI components
│       │   ├── quiz-card.js       # Quiz interface
│       │   ├── exercise-card.js   # Exercise selection
│       │   ├── progress-bar.js    # Progress tracking
│       │   └── feedback.js        # Feedback system
│       └── utils/                 # Utilities
│           ├── constants.js       # App constants
│           ├── helpers.js         # Helper functions
│           └── validators.js      # Validation logic
```

## 🚀 Quick Start

### 1. Download & Setup
```bash
# Clone hoặc download project
git clone <repository-url>
cd japanese-learning-app

# Install dependencies (optional)
npm install
```

### 2. Chuẩn Bị Dữ Liệu
Tạo 2 file JSON với cấu trúc sau:

**questions.json:**
```json
{
  "verbs-present": [
    {
      "question": "がっこうに いきます。",
      "meaning": "(đi học)",
      "prefix": "がっこうに"
    }
  ],
  "adjectives-i": [
    {
      "question": "このりんごは おいしいです。",
      "meaning": "(quả táo này ngon)",
      "prefix": "このりんごは"
    }
  ]
}
```

**answers.json:**
```json
{
  "verbs-present": [
    {
      "answer": "いく",
      "explanation": "Động từ Group 1: ます → く"
    }
  ],
  "adjectives-i": [
    {
      "answer": "おいしい",
      "explanation": "Tính từ い: bỏ です"
    }
  ]
}
```

### 3. Chạy Development Server
```bash
# Sử dụng live-server (recommended)
npm run dev

# Hoặc Python server
python -m http.server 8000

# Hoặc Node.js serve
npx serve .

# Hoặc VS Code Live Server
# Right-click index.html → "Open with Live Server"
```

### 4. Mở Browser
```
http://localhost:8080  # (live-server)
http://localhost:8000  # (Python)
http://localhost:3000  # (serve)
```

## 📝 Danh Sách Bài Tập Hỗ Trợ

### Động Từ (Verbs)
- `verbs-present` - Động từ hiện tại
- `verbs-past` - Động từ quá khứ  
- `verbs-negative` - Động từ phủ định
- `verbs-past-negative` - Động từ quá khứ phủ định

### Tính Từ (Adjectives)
- `adjectives-i` - Tính từ đuôi い
- `adjectives-na` - Tính từ đuôi な

### Danh Từ (Nouns)
- `nouns` - Danh từ

### Ngữ Pháp (Grammar Patterns)
- `grammar-patterns-must` - Phải làm (なければなりません)
- `grammar-patterns-ing` - Đang làm (ています)
- `grammar-patterns-forbidden` - Không được (てはいけません)
- `grammar-patterns-permission` - Có thể làm (てもいいです)
- `grammar-patterns-ability` - Có khả năng (ことができます)
- `grammar-patterns-experience` - Đã từng (ことがあります)
- `grammar-patterns-alternation` - Làm này làm kia (たりします)
- `grammar-patterns-become` - Trở nên (なります)

## 🔧 Development

### Tech Stack
- **Frontend:** HTML5, JavaScript ES6+, Tailwind CSS
- **Icons:** Font Awesome 6
- **Fonts:** Inter, Noto Sans JP
- **Storage:** LocalStorage
- **Build:** No build process (vanilla JS)

### Code Style
- **ES6+ Modules** với import/export
- **Component-based** architecture
- **Event-driven** communication
- **Functional programming** style
- **JSDoc** comments for documentation

### Adding New Exercise Types

1. **Update constants.js:**
```javascript
export const EXERCISE_DEFINITIONS = {
  'new-exercise-type': {
    title: 'Tên Bài Tập',
    description: 'Mô tả bài tập',
    icon: 'fas fa-icon',
    color: 'blue',
    category: 'category',
    theory: `<h4>Lý thuyết...</h4>`
  }
};
```

2. **Add data to JSON files:**
```json
// questions.json
{
  "new-exercise-type": [
    {
      "question": "Japanese sentence",
      "meaning": "(Vietnamese meaning)",
      "prefix": "sentence prefix"
    }
  ]
}

// answers.json
{
  "new-exercise-type": [
    {
      "answer": "correct answer",
      "explanation": "explanation text"
    }
  ]
}
```

### Customization

#### Colors & Themes
Chỉnh sửa trong `<script>` tag của `index.html`:
```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: { /* custom colors */ }
      }
    }
  }
}
```

#### Add New Features
1. Tạo module mới trong `assets/js/modules/`
2. Import vào `app.js`
3. Initialize trong `JapaneseApp` class

## 🎯 Features Roadmap

### ✅ Completed
- [x] Quiz system với 16 loại bài tập
- [x] Dark/Light theme
- [x] Progress tracking
- [x] Review system cho câu sai
- [x] Mobile responsive
- [x] Local storage
- [x] Achievement system
- [x] Statistics dashboard

### 🚧 In Progress
- [ ] Audio pronunciation
- [ ] Spaced repetition algorithm
- [ ] Export/import progress
- [ ] Multiple difficulty levels

### 📋 Planned
- [ ] User accounts & sync
- [ ] Multiplayer challenges
- [ ] Custom exercise creation
- [ ] Detailed analytics
- [ ] Offline PWA mode
- [ ] Voice recognition
- [ ] AI-powered hints

## 🐛 Troubleshooting

### Common Issues

**"CORS Error" khi load JSON:**
```bash
# Phải chạy qua HTTP server, không được mở file:// trực tiếp
npm run dev
# hoặc
python -m http.server 8000
```

**Dark mode không hoạt động:**
- Kiểm tra `localStorage` có bị disabled không
- Clear browser cache và thử lại

**Performance chậm:**
- Kiểm tra file JSON có quá lớn không (>1MB)
- Mở DevTools → Performance tab để debug

**Mobile layout bị lỗi:**
- Kiểm tra viewport meta tag
- Test trên Chrome DevTools mobile emulator

### Debug Mode
Bật debug trong `constants.js`:
```javascript
export const APP_CONFIG = {
  DEBUG: true, // Hiện debug logs
  // ...
};
```

## 🤝 Contributing

### Development Setup
```bash
# Install development tools
npm install -D live-server prettier eslint

# Format code
npm run format

# Lint code  
npm run lint

# Start dev server
npm run dev
```

### Code Guidelines
- Sử dụng **ES6+ syntax**
- **JSDoc comments** cho functions
- **Semantic HTML** và ARIA labels
- **Mobile-first** responsive design
- **Component isolation** - mỗi component tự quản lý state

### Pull Request Process
1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.

## 🙏 Credits

- **UI Design:** Inspired by modern language learning apps
- **Japanese Fonts:** Google Fonts (Noto Sans JP)
- **Icons:** Font Awesome
- **CSS Framework:** Tailwind CSS
- **Developer:** [Your Name]

## 📞 Support

- **Issues:** GitHub Issues
- **Email:** your-email@domain.com
- **Documentation:** Wiki page

---

Made with ❤️ for Japanese learners worldwide 🌍