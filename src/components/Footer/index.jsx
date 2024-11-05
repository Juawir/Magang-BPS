export default function Footer() {
    return (
      <footer className="bg-gray-900 text-white py-3">
        <div className="flex justify-between items-center mx-auto w-full max-w-screen-lg px-7">
          <p className="text-sm text-white">Data Berkualitas, Desa Berkelanjutan</p>
          <div className="flex items-center">
            <img
              src="https://www.bps.go.id/_next/image?url=%2Fassets%2Flogo-bps.png&w=1080&q=75"
              alt="BPS Logo"
              width={25}
              height={25}
              className="mr-6"
            />
            <p className="text-sm text-white">2024© BPS Kabupaten Sidoarjo</p>
          </div>
        </div>
      </footer>
    );
  }
  