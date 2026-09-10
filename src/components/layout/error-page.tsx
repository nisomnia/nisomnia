import { Button } from "@/components/ui/button"

export function ErrorPage({ onReset }: { onReset?: () => void }) {
  return (
    <div className="status-page">
      <h1 className="text-2xl font-semibold">Terjadi kesalahan</h1>
      <p className="text-muted-foreground">
        Maaf, terjadi kesalahan saat memuat halaman ini. Silakan coba lagi.
      </p>
      <Button onClick={onReset}>Coba lagi</Button>
    </div>
  )
}
