interface CriticismCardProps {
  title: string
  subtitle: string
  description: string
  sections: {
    icon: string
    title: string
    color: string
    points: string[]
  }[]
}

export function CriticismCard({ title, subtitle, description, sections }: CriticismCardProps) {
  return (
    <div className="space-y-6">
      {/* Title Section */}
      <div className="space-y-1">
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
        <p className="text-sm text-muted-foreground/80">{description}</p>
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Criticism Sections */}
      <div className="space-y-6">
        {sections.map((section, index) => (
          <div key={index} className="space-y-2">
            <h4 className={`text-lg font-bold ${section.color}`}>
              {section.icon} {section.title}
            </h4>
            <div className="text-muted-foreground/30">━━━━━━━━━━━━━━</div>
            <ul className="space-y-2">
              {section.points.map((point, pointIndex) => (
                <li key={pointIndex} className="text-sm leading-relaxed text-foreground/90">
                  • {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Expand Button */}
      <button className="w-full rounded-lg bg-muted py-2 text-foreground/70 transition-colors hover:bg-muted/80">
        展开强硬反驳 ▼
      </button>
    </div>
  )
}
