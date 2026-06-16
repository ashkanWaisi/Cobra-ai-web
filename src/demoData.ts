// COBRA AI Studio - Demo Data
// To add new models: add entries to the models array
// To add tutorials: add entries to the tutorials array  
// To add documentation: add entries to the docs array

export interface Model {
  id: string;
  name: string;
  type: 'image' | 'video' | 'chat';
  size: string;
  vram: string;
  status: 'installed' | 'available' | 'downloading';
  progress?: number;
}

export const models: Model[] = [
  { id: 'm1', name: 'Z-Image Turbo', type: 'image', size: '3.2 GB', vram: '6 GB', status: 'installed' },
  { id: 'm2', name: 'High Quality Image XL', type: 'image', size: '6.9 GB', vram: '8 GB', status: 'installed' },
  { id: 'm3', name: 'LTX Video', type: 'video', size: '8.4 GB', vram: '12 GB', status: 'available' },
  { id: 'm4', name: 'Local Chat 4B', type: 'chat', size: '2.4 GB', vram: '4 GB', status: 'installed' },
  { id: 'm5', name: 'Local Vision Model', type: 'image', size: '4.1 GB', vram: '6 GB', status: 'available' },
  { id: 'm6', name: 'Fast Image Gen', type: 'image', size: '1.8 GB', vram: '4 GB', status: 'available' },
  { id: 'm7', name: 'Video Motion XL', type: 'video', size: '12.2 GB', vram: '16 GB', status: 'available' },
  { id: 'm8', name: 'Local Chat 8B', type: 'chat', size: '4.7 GB', vram: '8 GB', status: 'available' },
  { id: 'm9', name: 'Compact Image SD', type: 'image', size: '2.1 GB', vram: '4 GB', status: 'available' },
  { id: 'm10', name: 'Video Clip Gen', type: 'video', size: '6.8 GB', vram: '10 GB', status: 'available' },
];

export interface Tutorial {
  id: string;
  titleKey: string;
  title_en: string;
  title_fa: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: string;
  category_en: string;
  category_fa: string;
  steps_en: string[];
  steps_fa: string[];
}

export const tutorials: Tutorial[] = [
  {
    id: 't1',
    titleKey: 'tut1',
    title_en: 'Installing COBRA AI Studio',
    title_fa: 'نصب COBRA AI Studio',
    difficulty: 'beginner',
    readTime: '5 min',
    category_en: 'Getting Started',
    category_fa: 'شروع کار',
    steps_en: [
      'Download the COBRA installer from the official website. The installer is a standard Windows executable (.exe) file approximately 120 MB in size.',
      'Run the installer by double-clicking the downloaded file. Windows may show a SmartScreen prompt — click "More info" and then "Run anyway" if you trust the source.',
      'Follow the installation wizard. Choose your preferred installation directory. The default location is usually fine for most users.',
      'Wait for the installation to complete. COBRA will install the application files, create shortcuts, and set up the initial configuration.',
      'Launch COBRA AI Studio from the Start menu or desktop shortcut. On first launch, the application will initialize its settings and prepare the model directory.',
    ],
    steps_fa: [
      'نصب‌کننده COBRA را از وبسایت رسمی دانلود کنید. نصب‌کننده یک فایل اجرایی استاندارد ویندوز (.exe) با حجم تقریبی ۱۲۰ مگابایت است.',
      'نصب‌کننده را با دوبار کلیک روی فایل دانلودشده اجرا کنید. ویندوز ممکن است هشدار SmartScreen نشان دهد.',
      'دستورالعمل‌های نصب را دنبال کنید. دایرکتوری نصب دلخواه خود را انتخاب کنید.',
      'منتظر بمانید تا نصب کامل شود. COBRA فایل‌های برنامه را نصب، میانبرها را ایجاد و تنظیمات اولیه را آماده می‌کند.',
      'COBRA AI Studio را از منوی Start یا میانبر دسکتاپ اجرا کنید. در اولین اجرا، برنامه تنظیمات خود را مقداردهی اولیه می‌کند.',
    ],
  },
  {
    id: 't2',
    titleKey: 'tut2',
    title_en: 'Downloading Your First Model',
    title_fa: 'دانلود اولین مدل',
    difficulty: 'beginner',
    readTime: '4 min',
    category_en: 'Getting Started',
    category_fa: 'شروع کار',
    steps_en: [
      'Open COBRA AI Studio and navigate to the Model Hub section from the left sidebar or top navigation.',
      'Browse the available models. You can filter by type (Image, Video, Chat) to find what you need.',
      'Select a model that fits your hardware. Check the VRAM requirement — for a first model, "Z-Image Turbo" (3.2 GB, 6 GB VRAM) is a good starting point.',
      'Click the "Install" button on the model card. The download will begin and you can track progress in real-time.',
      'Wait for the download to complete. Once finished, the model status will change to "Installed" and you can start generating immediately.',
    ],
    steps_fa: [
      'COBRA AI Studio را باز کنید و به بخش مرکز مدل‌ها از نوار کناری یا ناوبری بالا بروید.',
      'مدل‌های موجود را مرور کنید. می‌توانید بر اساس نوع (تصویر، ویدیو، گفتگو) فیلتر کنید.',
      'مدلی متناسب با سخت‌افزار خود انتخاب کنید. نیاز VRAM را بررسی کنید.',
      'دکمه "نصب" را روی کارت مدل کلیک کنید. دانلود شروع می‌شود و می‌توانید پیشرفت را به صورت زنده پیگیری کنید.',
      'منتظر بمانید تا دانلود کامل شود. پس از اتمام، وضعیت مدل به "نصب‌شده" تغییر می‌کند.',
    ],
  },
  {
    id: 't3',
    titleKey: 'tut3',
    title_en: 'Generating Your First Image',
    title_fa: 'تولید اولین تصویر',
    difficulty: 'beginner',
    readTime: '3 min',
    category_en: 'Image Generation',
    category_fa: 'تولید تصویر',
    steps_en: [
      'Make sure you have at least one image generation model installed. Check the Model Hub if needed.',
      'Navigate to the Image Generation tab. Select your installed image model from the model dropdown.',
      'Write a descriptive prompt. For example: "A serene mountain lake at sunrise with mist rising from the water." Be specific about what you want to see.',
      'Adjust generation settings: set your preferred width and height, number of steps (20-30 is a good start), and optionally set a seed for reproducible results.',
      'Click "Generate" and wait for the process to complete. The generated image will appear in the preview area and be saved to your output folder.',
    ],
    steps_fa: [
      'مطمئن شوید حداقل یک مدل تولید تصویر نصب شده دارید. در صورت نیاز مرکز مدل‌ها را بررسی کنید.',
      'به تب تولید تصویر بروید. مدل تصویری نصب‌شده را از منوی کشویی انتخاب کنید.',
      'یک پرامپت توصیفی بنویسید. مثلاً: "یک دریاچه کوهستانی آرام در طلوع آفتاب با مه در حال بلند شدن از آب."',
      'تنظیمات تولید را تنظیم کنید: عرض و ارتفاع، تعداد مراحل (۲۰-۳۰ شروع خوبی است).',
      'روی "تولید" کلیک کنید و منتظر بمانید. تصویر تولیدشده در ناحیه پیش‌نمایش ظاهر و در پوشه خروجی ذخیره می‌شود.',
    ],
  },
  {
    id: 't4',
    titleKey: 'tut4',
    title_en: 'Creating Image-to-Video',
    title_fa: 'ایجاد تصویر به ویدیو',
    difficulty: 'intermediate',
    readTime: '5 min',
    category_en: 'Video Generation',
    category_fa: 'تولید ویدیو',
    steps_en: [
      'Install a video generation model from the Model Hub. Video models typically require more VRAM (10-16 GB recommended).',
      'Navigate to the Video Generation tab. Select your installed video model.',
      'Upload a reference image by clicking the reference image area. This image will serve as the starting frame for your video.',
      'Write a prompt describing the motion or action you want. For example: "Camera slowly zooms in, gentle wind moves the leaves."',
      'Set duration (in seconds), FPS, and resolution. Start with shorter durations (2-4 seconds) for faster generation. Click "Generate" to create your video clip.',
    ],
    steps_fa: [
      'یک مدل تولید ویدیو از مرکز مدل‌ها نصب کنید. مدل‌های ویدیویی معمولاً به VRAM بیشتری نیاز دارند (۱۰-۱۶ گیگابایت پیشنهادی).',
      'به تب تولید ویدیو بروید. مدل ویدیویی نصب‌شده خود را انتخاب کنید.',
      'یک تصویر مرجع با کلیک روی ناحیه تصویر مرجع آپلود کنید.',
      'یک پرامپت توصیف‌کننده حرکت بنویسید. مثلاً: "دوربین آهسته زوم می‌کند، باد ملایم برگ‌ها را حرکت می‌دهد."',
      'مدت (ثانیه)، فریم بر ثانیه و وضوح را تنظیم کنید. با مدت‌های کوتاه‌تر (۲-۴ ثانیه) شروع کنید. روی "تولید" کلیک کنید.',
    ],
  },
  {
    id: 't5',
    titleKey: 'tut5',
    title_en: 'Managing Outputs',
    title_fa: 'مدیریت خروجی‌ها',
    difficulty: 'beginner',
    readTime: '3 min',
    category_en: 'File Management',
    category_fa: 'مدیریت فایل',
    steps_en: [
      'COBRA saves all generated images and videos to a designated output folder on your computer.',
      'Access the History section to browse previously generated content. Each entry shows a thumbnail, timestamp, and the settings used.',
      'Click on any history item to view full details. You can open the file location, copy settings, or regenerate with the same parameters.',
      'To change the output folder, go to Settings and update the output path. You can use any local drive or folder.',
      'Organize your outputs by creating subfolder structures. COBRA respects your file system organization.',
    ],
    steps_fa: [
      'COBRA تمام تصاویر و ویدیوهای تولیدشده را در پوشه خروجی مشخصی روی کامپیوتر شما ذخیره می‌کند.',
      'به بخش تاریخچه برای مرور محتوای تولیدشده قبلی دسترسی پیدا کنید.',
      'روی هر آیتم تاریخچه کلیک کنید تا جزئیات کامل را ببینید.',
      'برای تغییر پوشه خروجی، به تنظیمات بروید و مسیر خروجی را به‌روز کنید.',
      'خروجی‌های خود را با ایجاد ساختار زیرپوشه سازماندهی کنید.',
    ],
  },
  {
    id: 't6',
    titleKey: 'tut6',
    title_en: 'Choosing GPU or CPU Processing',
    title_fa: 'انتخاب پردازش GPU یا CPU',
    difficulty: 'intermediate',
    readTime: '4 min',
    category_en: 'Performance',
    category_fa: 'عملکرد',
    steps_en: [
      'COBRA supports both GPU and CPU processing modes. GPU processing is significantly faster and recommended for regular use.',
      'Check your system\'s GPU capabilities. COBRA works best with NVIDIA GPUs that have sufficient VRAM for your chosen model.',
      'To switch processing modes, navigate to Settings > Processing. Select either GPU or CPU mode.',
      'GPU mode: Utilizes your NVIDIA GPU\'s CUDA cores for fast parallel processing. Requires compatible GPU with adequate VRAM.',
      'CPU mode: Uses your system\'s processor. Works on any system but generation times are much longer. Useful for testing or systems without dedicated GPUs.',
    ],
    steps_fa: [
      'COBRA از هر دو حالت پردازش GPU و CPU پشتیبانی می‌کند. پردازش GPU به‌طور قابل توجهی سریع‌تر است.',
      'قابلیت‌های GPU سیستم خود را بررسی کنید. COBRA بهترین عملکرد را با GPUهای NVIDIA دارد.',
      'برای تغییر حالت پردازش، به تنظیمات > پردازش بروید. GPU یا CPU را انتخاب کنید.',
      'حالت GPU: از هسته‌های CUDA برای پردازش موازی سریع استفاده می‌کند.',
      'حالت CPU: از پردازنده سیستم استفاده می‌کند. روی هر سیستمی کار می‌کند اما بسیار کندتر است.',
    ],
  },
  {
    id: 't7',
    titleKey: 'tut7',
    title_en: 'Solving Common Runtime Errors',
    title_fa: 'حل خطاهای رایج زمان اجرا',
    difficulty: 'advanced',
    readTime: '6 min',
    category_en: 'Troubleshooting',
    category_fa: 'عیب‌یابی',
    steps_en: [
      'Out of Memory (OOM) errors occur when a model requires more VRAM than available. Try: reducing resolution, using a smaller model, or closing other GPU applications.',
      'Download failures can happen due to network issues. Use the resume feature to continue interrupted downloads. Check your internet connection and available disk space.',
      'If generation produces unexpected results, verify your model is fully downloaded (check for corruption). Try a different seed or adjust the number of steps.',
      'Runtime initialization errors may occur on first launch. Ensure your system meets minimum requirements and that GPU drivers are up to date.',
      'If COBRA fails to start, try running as administrator, checking antivirus exclusions, or reinstalling with the latest version.',
    ],
    steps_fa: [
      'خطاهای کمبود حافظه زمانی رخ می‌دهد که مدل به VRAM بیشتری نیاز دارد. وضوح را کاهش دهید یا مدل کوچکتری استفاده کنید.',
      'شکست دانلود ممکن است به دلیل مشکلات شبکه باشد. از قابلیت ادامه استفاده کنید.',
      'اگر تولید نتایج غیرمنتظره دارد، بررسی کنید مدل کامل دانلود شده باشد. سید متفاوت یا مراحل بیشتر امتحان کنید.',
      'خطاهای مقداردهی اولیه ممکن است در اولین اجرا رخ دهد. پیش‌نیازها و درایورهای GPU را بررسی کنید.',
      'اگر COBRA اجرا نمی‌شود، اجرا به عنوان مدیر، بررسی استثناهای آنتی‌ویروس یا نصب مجدد را امتحان کنید.',
    ],
  },
  {
    id: 't8',
    titleKey: 'tut8',
    title_en: 'Changing Model Folders',
    title_fa: 'تغییر پوشه مدل‌ها',
    difficulty: 'intermediate',
    readTime: '3 min',
    category_en: 'Configuration',
    category_fa: 'پیکربندی',
    steps_en: [
      'By default, COBRA stores models in a designated folder within the application directory.',
      'To change the model storage location, open COBRA Settings and find the "Model Directory" option.',
      'Click "Browse" and select your preferred folder. This can be on any local drive, including external drives with sufficient space.',
      'COBRA will detect any compatible models already present in the new directory. Previously downloaded models in the old location remain unchanged.',
      'Restart COBRA after changing the model directory to ensure all paths are properly updated.',
    ],
    steps_fa: [
      'به‌صورت پیش‌فرض، COBRA مدل‌ها را در پوشه‌ای مشخص در دایرکتوری برنامه ذخیره می‌کند.',
      'برای تغییر محل ذخیره‌سازی، تنظیمات COBRA را باز کنید و گزینه "دایرکتوری مدل" را پیدا کنید.',
      'روی "مرور" کلیک کنید و پوشه دلخواه خود را انتخاب کنید.',
      'COBRA مدل‌های سازگار موجود در دایرکتوری جدید را شناسایی می‌کند.',
      'پس از تغییر دایرکتوری مدل، COBRA را مجدداً راه‌اندازی کنید.',
    ],
  },
];

export interface DocSection {
  id: string;
  title_en: string;
  title_fa: string;
  content_en: string;
  content_fa: string;
  headings_en: string[];
  headings_fa: string[];
}

export const docSections: DocSection[] = [
  {
    id: 'getting-started',
    title_en: 'Getting Started',
    title_fa: 'شروع کار',
    headings_en: ['Overview', 'First Launch', 'Interface Tour'],
    headings_fa: ['نمای کلی', 'اولین اجرا', 'تور رابط کاربری'],
    content_en: `COBRA AI Studio is a professional offline AI creation studio for Windows. It enables you to generate images, create videos, and chat with AI models — all running locally on your computer.\n\nAfter installing COBRA, launch it from the Start menu or desktop shortcut. On first launch, the application initializes its configuration, sets up the model directory, and prepares the runtime environment.\n\nThe main interface consists of a left sidebar for navigation, a central workspace for generation controls, and a right panel for output preview and history. Use the top tabs to switch between Image Generation, Video Generation, and Chat modes.`,
    content_fa: `COBRA AI Studio یک استودیوی حرفه‌ای خلق هوش مصنوعی آفلاین برای ویندوز است. به شما امکان تولید تصویر، ایجاد ویدیو و گفتگو با مدل‌های هوش مصنوعی را می‌دهد — همه به صورت محلی.\n\nپس از نصب COBRA، آن را از منوی Start اجرا کنید. در اولین اجرا، برنامه تنظیمات خود را مقداردهی اولیه و محیط اجرا را آماده می‌کند.\n\nرابط اصلی شامل نوار کناری چپ برای ناوبری، فضای کاری مرکزی و پنل سمت راست برای پیش‌نمایش و تاریخچه است.`,
  },
  {
    id: 'installation',
    title_en: 'Installation',
    title_fa: 'نصب',
    headings_en: ['System Requirements', 'Download', 'Install Steps', 'Uninstalling'],
    headings_fa: ['پیش‌نیازهای سیستم', 'دانلود', 'مراحل نصب', 'حذف نصب'],
    content_en: `Download the COBRA installer from the official website. The installer supports Windows 10 (64-bit) and Windows 11.\n\nMinimum requirements: 16 GB RAM, modern multi-core CPU. For GPU acceleration, an NVIDIA GPU with at least 6 GB VRAM is recommended.\n\nInstallation steps:\n1. Run the downloaded .exe installer\n2. Accept the license agreement\n3. Choose installation directory\n4. Wait for installation to complete\n5. Launch COBRA from the Start menu\n\nTo uninstall, use Windows Settings > Apps > COBRA AI Studio > Uninstall.`,
    content_fa: `نصب‌کننده COBRA را از وبسایت رسمی دانلود کنید. نصب‌کننده از ویندوز ۱۰ (۶۴ بیتی) و ویندوز ۱۱ پشتیبانی می‌کند.\n\nحداقل پیش‌نیازها: ۱۶ گیگابایت RAM، پردازنده چند هسته‌ای مدرن.\n\nمراحل نصب:\n۱. نصب‌کننده .exe را اجرا کنید\n۲. توافقنامه مجوز را بپذیرید\n۳. دایرکتوری نصب را انتخاب کنید\n۴. منتظر اتمام نصب بمانید\n۵. COBRA را از منوی Start اجرا کنید`,
  },
  {
    id: 'model-management',
    title_en: 'Model Management',
    title_fa: 'مدیریت مدل',
    headings_en: ['Model Hub', 'Installing Models', 'Storage', 'Removing Models'],
    headings_fa: ['مرکز مدل‌ها', 'نصب مدل‌ها', 'فضای ذخیره‌سازی', 'حذف مدل‌ها'],
    content_en: `The Model Hub is your central location for discovering, downloading, and managing AI models. Access it from the sidebar navigation.\n\nTo install a model, browse or search the available models, check hardware requirements, and click "Install." Downloads support pause and resume functionality.\n\nModels are stored locally on your drive. The default location is within the COBRA application data folder, but you can configure a custom path in Settings.\n\nTo remove an installed model, find it in the Model Hub, click the model card, and select "Remove." This frees up the disk space used by that model.`,
    content_fa: `مرکز مدل‌ها محل اصلی شما برای کشف، دانلود و مدیریت مدل‌های هوش مصنوعی است.\n\nبرای نصب مدل، مدل‌های موجود را مرور یا جستجو کنید و روی "نصب" کلیک کنید. دانلودها از توقف و ادامه پشتیبانی می‌کنند.\n\nمدل‌ها به صورت محلی روی درایو شما ذخیره می‌شوند. مسیر پیش‌فرض در پوشه داده‌های COBRA است.\n\nبرای حذف مدل نصب‌شده، آن را در مرکز مدل‌ها پیدا کنید و "حذف" را انتخاب کنید.`,
  },
  {
    id: 'image-generation',
    title_en: 'Image Generation',
    title_fa: 'تولید تصویر',
    headings_en: ['Text-to-Image', 'Settings', 'Seeds', 'Output'],
    headings_fa: ['متن به تصویر', 'تنظیمات', 'سیدها', 'خروجی'],
    content_en: `Image generation in COBRA uses locally installed diffusion models to create images from text prompts.\n\nKey settings:\n- Prompt: Describe the image you want to create\n- Model: Select from your installed image models\n- Width/Height: Set output resolution (model-dependent limits)\n- Steps: Number of diffusion steps (more steps = higher quality, slower)\n- Seed: Set a specific seed for reproducible results, or use -1 for random\n\nGenerated images are saved automatically to your configured output folder. You can view them in the History panel.`,
    content_fa: `تولید تصویر در COBRA از مدل‌های نفوذ نصب‌شده محلی برای ایجاد تصاویر از پرامپت‌های متنی استفاده می‌کند.\n\nتنظیمات کلیدی:\n- پرامپت: تصویر مورد نظر را توصیف کنید\n- مدل: از مدل‌های نصب‌شده انتخاب کنید\n- عرض/ارتفاع: وضوح خروجی\n- مراحل: تعداد مراحل نفوذ\n- سید: برای نتایج تکرارپذیر`,
  },
  {
    id: 'video-generation',
    title_en: 'Video Generation',
    title_fa: 'تولید ویدیو',
    headings_en: ['Text-to-Video', 'Image-to-Video', 'Settings', 'Performance'],
    headings_fa: ['متن به ویدیو', 'تصویر به ویدیو', 'تنظیمات', 'عملکرد'],
    content_en: `COBRA supports video generation using locally installed video diffusion models.\n\nText-to-Video: Describe a scene and COBRA generates a short video clip. Video models typically require more VRAM than image models.\n\nImage-to-Video: Provide a reference image as a starting frame. The model animates the scene based on your prompt and the reference image.\n\nVideo settings include duration (seconds), frames per second (FPS), and output resolution. Start with shorter durations for faster iteration.\n\nVideo generation is GPU-intensive. A GPU with 10+ GB VRAM is recommended for most video models.`,
    content_fa: `COBRA از تولید ویدیو با مدل‌های نفوذ ویدیویی محلی پشتیبانی می‌کند.\n\nمتن به ویدیو: یک صحنه را توصیف کنید و COBRA یک کلیپ ویدیویی کوتاه تولید می‌کند.\n\nتصویر به ویدیو: یک تصویر مرجع ارائه دهید. مدل صحنه را بر اساس پرامپت شما متحرک می‌کند.\n\nتنظیمات ویدیو شامل مدت، فریم بر ثانیه و وضوح خروجی است.`,
  },
  {
    id: 'local-chat',
    title_en: 'Local Chat',
    title_fa: 'گفتگوی محلی',
    headings_en: ['Starting a Chat', 'Model Selection', 'Context', 'Privacy'],
    headings_fa: ['شروع گفتگو', 'انتخاب مدل', 'زمینه', 'حریم خصوصی'],
    content_en: `Local Chat allows you to have conversations with AI language models running entirely on your computer.\n\nTo start chatting, select a chat model from the model dropdown and type your message. The model processes your input locally and generates responses without any internet connection.\n\nContext length determines how much of the conversation history the model can reference. Larger context requires more memory.\n\nAll conversations remain on your device. No messages are sent to external servers. You can delete conversation history at any time.`,
    content_fa: `گفتگوی محلی به شما امکان مکالمه با مدل‌های زبانی هوش مصنوعی کاملاً روی کامپیوتر شما را می‌دهد.\n\nبرای شروع، یک مدل گفتگو انتخاب و پیام خود را تایپ کنید. مدل ورودی را محلی پردازش می‌کند.\n\nطول زمینه تعیین می‌کند مدل چقدر از تاریخچه مکالمه را مرجع قرار دهد.\n\nتمام مکالمات روی دستگاه شما می‌مانند.`,
  },
  {
    id: 'queue-history',
    title_en: 'Queue & History',
    title_fa: 'صف و تاریخچه',
    headings_en: ['Generation Queue', 'History Browser', 'Output Management'],
    headings_fa: ['صف تولید', 'مرورگر تاریخچه', 'مدیریت خروجی'],
    content_en: `The Generation Queue allows you to line up multiple generation tasks. Each task is processed sequentially, and you can monitor progress in the queue panel.\n\nHistory stores records of all your generations, including thumbnails, prompts, and settings used. Click any history entry to view details or reuse its settings.\n\nOutputs are organized in your configured output folder. You can open the folder directly from COBRA to manage your generated files.`,
    content_fa: `صف تولید به شما امکان صف‌بندی چندین کار تولید را می‌دهد. هر کار به ترتیب پردازش می‌شود.\n\nتاریخچه سوابق تمام تولیدات شما را ذخیره می‌کند. روی هر ورودی کلیک کنید تا جزئیات را ببینید.\n\nخروجی‌ها در پوشه خروجی پیکربندی‌شده شما سازماندهی می‌شوند.`,
  },
  {
    id: 'settings',
    title_en: 'Settings',
    title_fa: 'تنظیمات',
    headings_en: ['General', 'Processing', 'Paths', 'Interface'],
    headings_fa: ['عمومی', 'پردازش', 'مسیرها', 'رابط کاربری'],
    content_en: `COBRA Settings allow you to customize the application behavior.\n\nGeneral: Language, theme, and startup options.\nProcessing: GPU/CPU selection, VRAM management, and performance settings.\nPaths: Configure model directory, output folder, and temporary file locations.\nInterface: UI preferences, notification settings, and display options.\n\nChanges to processing mode and model paths may require an application restart to take effect.`,
    content_fa: `تنظیمات COBRA به شما امکان سفارشی‌سازی رفتار برنامه را می‌دهد.\n\nعمومی: زبان، تم و گزینه‌های راه‌اندازی.\nپردازش: انتخاب GPU/CPU و تنظیمات عملکرد.\nمسیرها: پیکربندی دایرکتوری مدل و پوشه خروجی.\nرابط: ترجیحات UI و تنظیمات نمایش.`,
  },
  {
    id: 'output-folders',
    title_en: 'Output Folders',
    title_fa: 'پوشه‌های خروجی',
    headings_en: ['Default Location', 'Custom Paths', 'Organization'],
    headings_fa: ['مکان پیش‌فرض', 'مسیرهای سفارشی', 'سازماندهی'],
    content_en: `Generated files are saved to a local output folder. The default location is within your user documents directory.\n\nTo set a custom output path, navigate to Settings > Paths > Output Directory and browse to your preferred location.\n\nCOBRA organizes outputs by date and type. Image files are saved as PNG, and videos are saved in standard video formats. Each file includes metadata about the generation settings used.`,
    content_fa: `فایل‌های تولیدشده در پوشه خروجی محلی ذخیره می‌شوند. مکان پیش‌فرض در دایرکتوری اسناد کاربر شماست.\n\nبرای تنظیم مسیر سفارشی، به تنظیمات > مسیرها > دایرکتوری خروجی بروید.\n\nCOBRA خروجی‌ها را بر اساس تاریخ و نوع سازماندهی می‌کند.`,
  },
  {
    id: 'troubleshooting',
    title_en: 'Troubleshooting',
    title_fa: 'عیب‌یابی',
    headings_en: ['Common Issues', 'GPU Problems', 'Download Errors', 'Getting Help'],
    headings_fa: ['مشکلات رایج', 'مشکلات GPU', 'خطاهای دانلود', 'دریافت کمک'],
    content_en: `Common troubleshooting steps for COBRA AI Studio:\n\nOut of Memory: Reduce resolution, use fewer steps, or switch to a smaller model. Close other GPU-intensive applications.\n\nGPU Not Detected: Update your NVIDIA drivers to the latest version. Ensure CUDA is supported by your GPU model.\n\nDownload Errors: Check internet connection and available disk space. Use the resume feature for interrupted downloads.\n\nGeneration Failures: Verify model integrity by removing and re-downloading. Try different settings or a different model.\n\nApplication Won't Start: Run as administrator, check antivirus exclusions, or try reinstalling.`,
    content_fa: `مراحل عیب‌یابی رایج:\n\nکمبود حافظه: وضوح را کاهش دهید یا مدل کوچکتری استفاده کنید.\n\nGPU شناسایی نمی‌شود: درایورهای NVIDIA را به‌روز کنید.\n\nخطاهای دانلود: اتصال اینترنت و فضای دیسک را بررسی کنید.\n\nشکست تولید: با حذف و دانلود مجدد، صحت مدل را بررسی کنید.\n\nبرنامه اجرا نمی‌شود: به عنوان مدیر اجرا کنید.`,
  },
  {
    id: 'privacy',
    title_en: 'Privacy',
    title_fa: 'حریم خصوصی',
    headings_en: ['Local Processing', 'Data Handling', 'Network Usage'],
    headings_fa: ['پردازش محلی', 'مدیریت داده', 'استفاده شبکه'],
    content_en: `COBRA AI Studio is designed with privacy as a core principle.\n\nAll AI processing — image generation, video creation, and chat — happens entirely on your local computer. No prompts, images, videos, or conversation data is sent to external servers.\n\nNetwork connectivity is used only for:\n- Downloading models from the Model Hub\n- Checking for application updates (optional)\n\nYour generated content, model files, and settings are stored exclusively on your local file system. You have complete control over your data.`,
    content_fa: `COBRA AI Studio با حریم خصوصی به عنوان اصل اساسی طراحی شده است.\n\nتمام پردازش هوش مصنوعی کاملاً روی کامپیوتر محلی شما انجام می‌شود.\n\nاتصال شبکه فقط برای دانلود مدل‌ها و بررسی به‌روزرسانی (اختیاری) استفاده می‌شود.\n\nمحتوای تولیدشده، فایل‌های مدل و تنظیمات شما منحصراً روی سیستم فایل محلی ذخیره می‌شوند.`,
  },
  {
    id: 'license',
    title_en: 'License Activation',
    title_fa: 'فعال‌سازی مجوز',
    headings_en: ['Activation', 'License Types', 'Support'],
    headings_fa: ['فعال‌سازی', 'انواع مجوز', 'پشتیبانی'],
    content_en: `COBRA AI Studio licensing information will be provided with the application. Check the application settings or documentation for details on your license type and activation process.\n\nFor support with license-related questions, refer to the official COBRA documentation or support channels.`,
    content_fa: `اطلاعات مجوز COBRA AI Studio با برنامه ارائه می‌شود. تنظیمات برنامه یا مستندات را برای جزئیات مجوز بررسی کنید.\n\nبرای پشتیبانی مربوط به مجوز، به مستندات رسمی COBRA مراجعه کنید.`,
  },
];

export const screenshotPlaceholders = [
  { id: 's1', caption_en: 'Main Interface — Image Generation', caption_fa: 'رابط اصلی — تولید تصویر' },
  { id: 's2', caption_en: 'Video Generation Workspace', caption_fa: 'فضای کار تولید ویدیو' },
  { id: 's3', caption_en: 'Model Hub — Browse & Download', caption_fa: 'مرکز مدل‌ها — مرور و دانلود' },
  { id: 's4', caption_en: 'Local Chat Interface', caption_fa: 'رابط گفتگوی محلی' },
  { id: 's5', caption_en: 'Generation History & Outputs', caption_fa: 'تاریخچه تولید و خروجی‌ها' },
  { id: 's6', caption_en: 'Settings & Configuration', caption_fa: 'تنظیمات و پیکربندی' },
];
