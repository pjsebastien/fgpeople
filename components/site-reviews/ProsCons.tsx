/**
 * Les deux colonnes points forts / points faibles.
 * Un avis sans vrais points faibles ne convertit pas : c'est le bloc qui
 * établit la crédibilité de tout le reste de la page.
 */

export default function ProsCons({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-5">
        <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2">
          <span aria-hidden="true">✓</span> Points forts
        </h3>
        <ul className="space-y-2.5">
          {pros.map((p, i) => (
            <li key={i} className="flex gap-2.5 text-text-secondary text-sm leading-relaxed">
              <span className="text-green-400 shrink-0 mt-0.5" aria-hidden="true">
                +
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
        <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
          <span aria-hidden="true">✗</span> Points faibles
        </h3>
        <ul className="space-y-2.5">
          {cons.map((c, i) => (
            <li key={i} className="flex gap-2.5 text-text-secondary text-sm leading-relaxed">
              <span className="text-red-400 shrink-0 mt-0.5" aria-hidden="true">
                −
              </span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
