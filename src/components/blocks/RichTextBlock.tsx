import { RichText } from '@/components/RichText'

export function RichTextBlock({ block }: { block: any }) {
  return (
    <section className="py-16">
      <div className="container-x max-w-3xl prose prose-lg">
        <RichText content={block.content} />
      </div>
    </section>
  )
}
