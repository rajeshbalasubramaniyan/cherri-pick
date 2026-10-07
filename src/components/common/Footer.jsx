export default function Footer() {
  return (
    <footer className="bg-cherry text-white py-10 px-6 mt-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
          <img src="/cherri-full-logo.png" alt="Cherri" className="h-10 object-contain brightness-0 invert" />
          <div className="flex gap-6 text-sm font-body">
            <a href="https://cherri.group/privacy" className="text-white hover:text-white/80 transition-colors">Privacy Policy</a>
            <a href="https://cherri.group/terms" className="text-white hover:text-white/80 transition-colors">Terms</a>
            <a href="https://cherri.group" className="text-white hover:text-white/80 transition-colors">CHERRI GROUP</a>
          </div>
        </div>
        <div className="border-t border-white/20 pt-6 text-center">
          <p className="text-white text-xs font-body">
            Built with 🍒 in Bengaluru &middot; &copy; {new Date().getFullYear()} CHERRI GROUP. Where Daydreams Work!
          </p>
        </div>
      </div>
    </footer>
  )
}
