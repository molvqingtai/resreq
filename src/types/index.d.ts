interface Progress {
  ratio: number // Current Transfer Ratio
  carry: number // Current Transfer Byte Size
  total: number // Total size of transmitted bytes
}

type ProgressCallback = (progress: Progress, chunk: Uint8Array) => void
