import { Loader } from 'lucide-react'

interface LoadingProps {
  text?: string
}

export default function Loading({ text = 'Loading...' }: Readonly<LoadingProps>) {
  return (
    <div className="f-box mt-[22%] gap-2 text-zinc-400">
      <Loader className="animate-spin" size={20} />
      {text}
    </div>
  )
}

export const LoadingScreen = ({ text }: Readonly<LoadingProps>) => (
  <div className="h-full w-full">
    <Loading text={text} />
  </div>
)
