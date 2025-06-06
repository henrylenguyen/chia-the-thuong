/**
 * TheoryRenderer - Renders simple theory cards (old-source.html style)
 */
export class TheoryRenderer {
  constructor() {
    this.theoryData = null;
    this.exerciseDefinitions = null;
    this.questionsData = null;
  }

  /**
   * Initialize with theory data
   * @param {Object} theoryData - Theory data from JSON
   * @param {Object} exerciseDefinitions - Exercise definitions from JSON
   * @param {Object} questionsData - Questions data for counting
   */
  init(theoryData, exerciseDefinitions, questionsData = null) {
    this.theoryData = theoryData;
    this.exerciseDefinitions = exerciseDefinitions;
    this.questionsData = questionsData;
  }

  /**
   * Render simple theory content (old-source.html style)
   */
  renderTheoryContent() {
    const container = document.querySelector('#theory-page .grid');
    if (!container) {
      console.warn('Theory container not found');
      return;
    }

    // Check if required data is available
    if (!this.exerciseDefinitions) {
      console.warn('Exercise definitions not available for theory rendering');
      container.innerHTML = '<div class="col-span-full text-center text-gray-500">Đang tải dữ liệu...</div>';
      return;
    }

    // Create theory cards in old-source.html style
    container.innerHTML = this.createTheoryCards();
  }

  /**
   * Create theory cards in old-source.html style
   * @returns {string} HTML string for theory cards
   */
  createTheoryCards() {
    return `
      <!-- Enhanced Mind Map -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-12 border border-gray-200 dark:border-gray-700 col-span-full">
        <h2 class="text-2xl font-bold text-center mb-8 gradient-text">
          <i class="fas fa-sitemap mr-3"></i>Sơ Đồ Kiến Thức - Thể Thường
        </h2>

        <!-- Central Node -->
        <div class="flex flex-col items-center">
          <div class="gradient-bg text-white px-8 py-6 rounded-2xl text-2xl font-bold shadow-2xl mb-8 font-japanese">
            普通形<br><small class="text-sm opacity-90">(Thể Thường)</small>
          </div>

          <!-- Branches -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            <!-- Verbs -->
            <div class="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div class="flex items-center mb-4">
                <i class="fas fa-running text-blue-500 text-2xl mr-3"></i>
                <h3 class="text-lg font-bold text-blue-700 dark:text-blue-300">Động Từ</h3>
              </div>
              <div class="space-y-2 text-sm">
                <div class="bg-white dark:bg-gray-800 p-2 rounded font-japanese">行きます → 行く</div>
                <div class="bg-white dark:bg-gray-800 p-2 rounded font-japanese">行きました → 行った</div>
                <div class="bg-white dark:bg-gray-800 p-2 rounded font-japanese">行きません → 行かない</div>
              </div>
            </div>

            <!-- i-Adjectives -->
            <div class="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl border-l-4 border-green-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div class="flex items-center mb-4">
                <i class="fas fa-palette text-green-500 text-2xl mr-3"></i>
                <h3 class="text-lg font-bold text-green-700 dark:text-green-300">Tính Từ い</h3>
              </div>
              <div class="space-y-2 text-sm">
                <div class="bg-white dark:bg-gray-800 p-2 rounded font-japanese">おいしいです → おいしい</div>
                <div class="bg-white dark:bg-gray-800 p-2 rounded font-japanese">おいしかった</div>
                <div class="bg-white dark:bg-gray-800 p-2 rounded font-japanese">おいしくない</div>
              </div>
            </div>

            <!-- na-Adjectives -->
            <div class="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl border-l-4 border-purple-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div class="flex items-center mb-4">
                <i class="fas fa-star text-purple-500 text-2xl mr-3"></i>
                <h3 class="text-lg font-bold text-purple-700 dark:text-purple-300">Tính Từ な</h3>
              </div>
              <div class="space-y-2 text-sm">
                <div class="bg-white dark:bg-gray-800 p-2 rounded font-japanese">きれいです → きれいだ</div>
                <div class="bg-white dark:bg-gray-800 p-2 rounded font-japanese">きれいだった</div>
                <div class="bg-white dark:bg-gray-800 p-2 rounded font-japanese">きれいじゃない</div>
              </div>
            </div>

            <!-- Nouns -->
            <div class="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl border-l-4 border-orange-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div class="flex items-center mb-4">
                <i class="fas fa-cube text-orange-500 text-2xl mr-3"></i>
                <h3 class="text-lg font-bold text-orange-700 dark:text-orange-300">Danh Từ</h3>
              </div>
              <div class="space-y-2 text-sm">
                <div class="bg-white dark:bg-gray-800 p-2 rounded font-japanese">学生です → 学生だ</div>
                <div class="bg-white dark:bg-gray-800 p-2 rounded font-japanese">学生だった</div>
                <div class="bg-white dark:bg-gray-800 p-2 rounded font-japanese">学生じゃない</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Theory Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 col-span-full">
        <!-- What is Casual Form -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <h3 class="text-2xl font-bold mb-6 flex items-center text-blue-600 dark:text-blue-400">
            <i class="fas fa-info-circle mr-3"></i>Thể Thường là gì?
          </h3>
          <div class="space-y-4 text-gray-700 dark:text-gray-300">
            <p>Thể Thường (普通形) được sử dụng trong:</p>
            <ul class="space-y-3">
              <li class="flex items-start">
                <i class="fas fa-comments text-blue-500 mt-1 mr-3"></i>
                <span>Các tình huống thân mật, không trang trọng</span>
              </li>
              <li class="flex items-start">
                <i class="fas fa-users text-green-500 mt-1 mr-3"></i>
                <span>Nói chuyện với bạn bè, người thân</span>
              </li>
              <li class="flex items-start">
                <i class="fas fa-book-open text-purple-500 mt-1 mr-3"></i>
                <span>Văn viết không trang trọng (blog, diary, manga)</span>
              </li>
              <li class="flex items-start">
                <i class="fas fa-link text-orange-500 mt-1 mr-3"></i>
                <span>Kết hợp với các mẫu ngữ pháp đặc biệt</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Conversion Rules -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <h3 class="text-2xl font-bold mb-6 flex items-center text-green-600 dark:text-green-400">
            <i class="fas fa-exchange-alt mr-3"></i>Quy Tắc Chuyển Đổi
          </h3>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-600">
                  <th class="text-left py-2 text-gray-700 dark:text-gray-300">Loại từ</th>
                  <th class="text-left py-2 text-gray-700 dark:text-gray-300">Lịch sự</th>
                  <th class="text-left py-2 text-gray-700 dark:text-gray-300">Thường</th>
                </tr>
              </thead>
              <tbody class="space-y-2">
                <tr class="border-b border-gray-100 dark:border-gray-700">
                  <td class="py-2 font-medium">Động từ</td>
                  <td class="py-2 font-japanese">Vます</td>
                  <td class="py-2 font-japanese text-blue-600">Vる</td>
                </tr>
                <tr class="border-b border-gray-100 dark:border-gray-700">
                  <td class="py-2 font-medium">Tính từ い</td>
                  <td class="py-2 font-japanese">Aいです</td>
                  <td class="py-2 font-japanese text-green-600">Aい</td>
                </tr>
                <tr class="border-b border-gray-100 dark:border-gray-700">
                  <td class="py-2 font-medium">Tính từ な</td>
                  <td class="py-2 font-japanese">Aなです</td>
                  <td class="py-2 font-japanese text-purple-600">Aだ</td>
                </tr>
                <tr>
                  <td class="py-2 font-medium">Danh từ</td>
                  <td class="py-2 font-japanese">Nです</td>
                  <td class="py-2 font-japanese text-orange-600">Nだ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Learning Tips -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <h3 class="text-2xl font-bold mb-6 flex items-center text-yellow-600 dark:text-yellow-400">
            <i class="fas fa-lightbulb mr-3"></i>Mẹo Học Tập
          </h3>
          <div class="space-y-4">
            <div class="flex items-start space-x-3">
              <i class="fas fa-repeat text-blue-500 mt-1"></i>
              <span>Luyện tập thường xuyên với bạn bè người Nhật</span>
            </div>
            <div class="flex items-start space-x-3">
              <i class="fas fa-film text-red-500 mt-1"></i>
              <span>Xem anime, drama để nghe thể thường trong thực tế</span>
            </div>
            <div class="flex items-start space-x-3">
              <i class="fas fa-book-reader text-green-500 mt-1"></i>
              <span>Đọc manga, tin nhắn social media</span>
            </div>
            <div class="flex items-start space-x-3">
              <i class="fas fa-target text-purple-500 mt-1"></i>
              <span>Đừng sợ sai - học từ sai lầm</span>
            </div>
          </div>
        </div>

        <!-- Practical Applications -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <h3 class="text-2xl font-bold mb-6 flex items-center text-purple-600 dark:text-purple-400">
            <i class="fas fa-puzzle-piece mr-3"></i>Ứng Dụng Thực Tế
          </h3>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Thể thường thường xuất hiện trong các mẫu ngữ pháp:</p>
          <div class="space-y-3">
            <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <strong class="font-japanese text-blue-600">と思います</strong> - tôi nghĩ rằng...
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <strong class="font-japanese text-green-600">でしょう</strong> - có lẽ, phải không
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <strong class="font-japanese text-purple-600">かもしれません</strong> - có thể
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <strong class="font-japanese text-orange-600">時、前に、後で</strong> - khi, trước, sau
            </div>
          </div>
        </div>
      </div>
    `;
  }




}
