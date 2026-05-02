import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setPendingUpload } from '../lib/pendingUpload'
import { uploadImageFile } from '../lib/uploadClient'

export default function HeroSlider() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)

  return (
    <div className="relative h-[400px] sm:h-[500px] md:h-[550px]">
      <div className="absolute inset-0 animate-fade1">
        <img
          src="/images/frames/frame1.jpg"
          alt="Frame collection"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="absolute inset-0 animate-fade2">
        <img
          src="/images/frames/frame2.jpg"
          alt="Minimal frame"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="absolute inset-0 animate-fade3">
        <img
          src="/images/frames/frame3.jpg"
          alt="Premium glass frame"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="text-3xl font-bold sm:text-5xl">
          Turn Your Memories Into
        </h1>
        <span className="text-3xl font-bold text-yellow-400 sm:text-5xl">
          Luxury Wall Art
        </span>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (event) => {
            const file = event.target.files?.[0]
            if (!file) return

            setUploading(true)

            try {
              const uploaded = await uploadImageFile(file)
              setPendingUpload(uploaded)
              navigate('/shop')
            } catch {
              alert('Photo upload failed. Please try again.')
            } finally {
              setUploading(false)
              event.target.value = ''
            }
          }}
        />

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full bg-yellow-500 px-5 py-2 font-semibold disabled:opacity-60"
          >
            {uploading ? 'Uploading...' : 'Upload Your Photo'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="rounded-full bg-white px-5 py-2 font-semibold text-black"
          >
            Browse Frames
          </button>
        </div>
      </div>
    </div>
  )
}
