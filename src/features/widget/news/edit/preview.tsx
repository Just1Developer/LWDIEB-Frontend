import { useUserData } from '@/features/shared/user-provider'

export const NewsWidgetPreview = () => {
  const { theme } = useUserData()
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <p className="mb-2 text-sm font-bold">BREAKING NEWS</p>
      <p
        className="bg-link rounded-sm border text-[80%] font-bold shadow-md"
        style={{
          backgroundColor: theme.backgroundBoard,
        }}
      >
        A New Invention Has Been Made That Can Change the World
      </p>
    </div>
  )
}
