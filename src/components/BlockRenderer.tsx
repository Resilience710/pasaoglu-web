import { HeroVideo } from './blocks/HeroVideo'
import { SplitTextImage } from './blocks/SplitTextImage'
import { StatsGrid } from './blocks/StatsGrid'
import { FeatureCards } from './blocks/FeatureCards'
import { PartnerMarquee } from './blocks/PartnerMarquee'
import { DocumentGrid } from './blocks/DocumentGrid'
import { Accordion } from './blocks/Accordion'
import { QuoteBand } from './blocks/QuoteBand'
import { RichTextBlock } from './blocks/RichTextBlock'
import { ProductAccordion } from './blocks/ProductAccordion'
import { PolicyNav } from './blocks/PolicyNav'
import { ContactBlock } from './blocks/ContactBlock'
import { ContactForm } from './blocks/ContactForm'
import { CareerForm } from './blocks/CareerForm'

const MAP: Record<string, React.FC<{ block: any }>> = {
  heroVideo: HeroVideo,
  splitTextImage: SplitTextImage,
  statsGrid: StatsGrid,
  featureCards: FeatureCards,
  partnerMarquee: PartnerMarquee,
  documentGrid: DocumentGrid,
  accordion: Accordion,
  quoteBand: QuoteBand,
  richText: RichTextBlock,
  productAccordion: ProductAccordion,
  policyNav: PolicyNav,
  contactBlock: ContactBlock,
  contactForm: ContactForm,
  careerForm: CareerForm,
}

export function BlockRenderer({ layout }: { layout: any[] }) {
  if (!Array.isArray(layout)) return null
  return (
    <>
      {layout.map((block, i) => {
        const Comp = MAP[block.blockType]
        if (!Comp) return null
        return <Comp key={block.id || i} block={block} />
      })}
    </>
  )
}
