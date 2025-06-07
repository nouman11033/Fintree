import { cookies } from 'next/headers'
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models'
import { generateUUID } from '@/lib/utils'
import PageClient from './PageClient'

export default async function Page() {
  const id = generateUUID()
  const cookieStore = await cookies()
  const modelIdFromCookie = cookieStore.get('chat-model')
  const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true'

  return <PageClient id={id} modelIdFromCookie={modelIdFromCookie?.value || DEFAULT_CHAT_MODEL} isCollapsed={isCollapsed} />
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-6 bg-gradient-to-br from-zinc-900/80 via-indigo-900/60 to-fuchsia-900/40 shadow-xl border border-indigo-800/30 backdrop-blur-md">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-indigo-200">
        {title}
      </h3>
      {children}
    </div>
  )
}