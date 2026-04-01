আপনার Shared App URL-টি একটি কাস্টম ডোমেইনের (যেমন: api.yourdomain.com) সাথে CNAME Record ব্যবহার করে কানেক্ট করার নিয়ম নিচে সহজভাবে দেওয়া হলো:
১. DNS সেটিংস পরিবর্তন করুন (Domain Provider Panel)
আপনার ডোমেইন প্রোভাইডারের (যেমন: Namecheap, GoDaddy, বা Cloudflare) ড্যাশবোর্ডে লগইন করুন এবং DNS Management সেকশনে যান। সেখানে একটি নতুন রেকর্ড যোগ করুন:
Type: CNAME
Host/Name: api (যদি আপনি api.yourdomain.com ব্যবহার করতে চান) অথবা @ (যদি মেইন ডোমেইন ব্যবহার করতে চান)।
Value/Target: ghs.googlehosted.com
TTL: Automatic বা 3600
বিঃদ্রঃ: সরাসরি আপনার Shared App URL-টি (...run.app) CNAME-এ বসাবেন না। গুগল ক্লাউড রান বা ফায়ারবেস হোস্টিংয়ের জন্য টার্গেট সবসময় ghs.googlehosted.com হয়।
২. Firebase Console-এ ডোমেইন যোগ করুন (খুবই গুরুত্বপূর্ণ)
আপনার ডোমেইনে গুগল লগইন (Google Login) কাজ করার জন্য এটি অবশ্যই করতে হবে:
Firebase Console-এ যান।
আপনার প্রজেক্টটি (imageapi-server) সিলেক্ট করুন।
Build > Authentication > Settings ট্যাবে যান।
Authorized Domains সেকশনে গিয়ে Add Domain বাটনে ক্লিক করুন।
আপনার কাস্টম ডোমেইনটি (যেমন: api.yourdomain.com) এখানে লিখে সেভ করুন।
৩. Google Cloud Console থেকে ম্যাপিং (যদি প্রয়োজন হয়)
যেহেতু আপনার অ্যাপটি Cloud Run-এ চলছে, আপনাকে Google Cloud Console-এর Cloud Run Domain Mappings পেজে গিয়ে আপনার ডোমেইনটি ভেরিফাই এবং ম্যাপ করতে হতে পারে। সেখানে:
Add Mapping-এ ক্লিক করুন।
আপনার সার্ভিসটি সিলেক্ট করুন।
ডোমেইনটি ভেরিফাই করুন।
গুগল আপনাকে কিছু A Record বা CNAME Record দিবে, সেগুলো আপনার DNS প্যানেলে আপডেট করুন।
৪. কোড আপডেট করুন
ডোমেইন কানেক্ট হয়ে গেলে আপনার অ্যাপের নিচের ফাইলগুলোতে গিয়ে পুরনো URL-এর জায়গায় নতুন ডোমেইন URL বসিয়ে দিন:
src/pages/APIKey.tsx
src/pages/Developer.tsx
সংক্ষেপে: আপনার ডোমেইন প্যানেলে CNAME হিসেবে ghs.googlehosted.com সেট করুন এবং Firebase-এ ডোমেইনটি Authorize করুন। সব সেটআপ হতে সাধারণত ৩০ মিনিট থেকে ২৪ ঘণ্টা সময় লাগতে পারে।
