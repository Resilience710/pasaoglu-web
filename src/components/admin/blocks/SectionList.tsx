'use client'

import React, { useState } from 'react'
import { ArrowUp, ArrowDown, Trash2, Plus } from 'lucide-react'
import { SectionCard } from '../fields'
import { renderBlockBody, blockLabel, newBlock, ADDABLE_BLOCKS } from './blockSections'

export default function SectionList({
  layout,
  onChange,
}: {
  layout: any[]
  onChange: (layout: any[]) => void
}) {
  const [addType, setAddType] = useState('')

  const patchBlock = (index: number, partial: Record<string, any>) =>
    onChange(layout.map((b, i) => (i === index ? { ...b, ...partial } : b)))

  const remove = (index: number) => onChange(layout.filter((_, i) => i !== index))

  const move = (index: number, dir: -1 | 1) => {
    const j = index + dir
    if (j < 0 || j >= layout.length) return
    const next = layout.slice()
    ;[next[index], next[j]] = [next[j], next[index]]
    onChange(next)
  }

  const add = () => {
    if (!addType) return
    onChange([...layout, newBlock(addType)])
    setAddType('')
  }

  return (
    <>
      {layout.map((block, index) => (
        <SectionCard
          key={index}
          num={index + 1}
          title={blockLabel(block.blockType)}
          desc={`Bölüm ${index + 1} / ${layout.length}`}
        >
          <div className="ae-sec-toolbar">
            <button type="button" className="ae-icon-btn" disabled={index === 0} onClick={() => move(index, -1)} title="Yukarı taşı">
              <ArrowUp size={15} />
            </button>
            <button type="button" className="ae-icon-btn" disabled={index === layout.length - 1} onClick={() => move(index, 1)} title="Aşağı taşı">
              <ArrowDown size={15} />
            </button>
            <button type="button" className="ae-icon-btn ae-icon-btn--danger" onClick={() => remove(index)} title="Bölümü sil">
              <Trash2 size={15} />
            </button>
          </div>
          {renderBlockBody(block, (partial) => patchBlock(index, partial))}
        </SectionCard>
      ))}

      <div className="ae-addsection">
        <select className="ae-input ae-select" value={addType} onChange={(e) => setAddType(e.target.value)}>
          <option value="">+ Bölüm Ekle — tip seçin…</option>
          {ADDABLE_BLOCKS.map((b) => (
            <option key={b.value} value={b.value}>{b.label}</option>
          ))}
        </select>
        <button type="button" className="ae-btn ae-btn--primary" onClick={add} disabled={!addType}>
          <Plus size={15} /> Ekle
        </button>
      </div>
    </>
  )
}
