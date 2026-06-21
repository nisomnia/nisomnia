export interface VideoMeta {
  videoId: string
  title: string
  description: string
  thumbnailUrl: string
  uploadDate: string | null
  duration: string | null
  width: number | undefined
  height: number | undefined
}
