import { Link } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"

export function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-muted-foreground text-5xl font-bold tracking-tight">
        404
      </p>
      <h1 className="text-2xl font-semibold">Halaman tidak ditemukan</h1>
      <p className="text-muted-foreground">
        Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>
      <Button render={<Link to="/" />}>Kembali ke beranda</Button>
    </div>
  )
}
