import { Link } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"

export function NotFound() {
  return (
    <div className="status-page">
      <p className="text-5xl font-bold tracking-tight text-muted-foreground">
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
