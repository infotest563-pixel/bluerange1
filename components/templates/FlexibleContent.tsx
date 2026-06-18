import { resolveImage } from '../../lib/resolveImage';

// ─── Section renderers ──────────────────────────────────────────────────────

async function HeroSection({ s }: { s: any }) {
    const bgUrl = await resolveImage(s.background_image);
    return (
        <section className="fc-hero relative min-h-[500px] lg:min-h-[650px] flex items-center overflow-hidden"
            style={{ backgroundImage: bgUrl ? `url('${bgUrl}')` : undefined }}>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,37,64,0.92), rgba(10,37,64,0.80), rgba(10,37,64,0.65))' }} />
            <div className="relative w-full max-w-[1200px] mx-auto px-6 py-20">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 max-w-3xl leading-tight">
                    {s.title}
                </h1>
                {s.subtitle && (
                    <p className="text-xl mb-10 max-w-2xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.9)' }}>
                        {s.subtitle}
                    </p>
                )}
                <div className="flex flex-wrap gap-4">
                    {s.primary_button_text && s.primary_button_link && (
                        <a href={s.primary_button_link}
                            className="inline-flex items-center px-8 py-3 bg-white font-semibold rounded-md transition-colors" style={{ color: '#0a2540' }}>
                            {s.primary_button_text}
                        </a>
                    )}
                </div>
                {s.hero_features?.length > 0 && (
                    <div className="flex flex-wrap gap-6 mt-12 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                        {s.hero_features.map((f: any, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#50c1ed' }} />
                                {f.text}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

function PricingSection({ s }: { s: any }) {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-[1200px] mx-auto px-6">
                {s.section_title && (
                    <h2 className="text-3xl font-bold text-center mb-12">{s.section_title}</h2>
                )}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {(s.plans || []).map((plan: any, i: number) => (
                        <div key={i} className={`relative flex flex-col rounded-2xl p-6 border-2 transition-all hover:shadow-lg`}
                            style={{ borderColor: plan.is_recommended ? '#50c1ed' : '#e5e7eb' }}>
                            {plan.is_recommended && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-white px-3 py-1 rounded-full text-xs font-semibold"
                                    style={{ backgroundColor: '#50c1ed' }}>
                                    Recommended
                                </div>
                            )}
                            {plan.discount_text && (
                                <span className="text-sm text-gray-500 mb-1">{plan.discount_text}</span>
                            )}
                            <h3 className="text-2xl font-bold uppercase tracking-wide mb-2">{plan.plan_name}</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                <span className="text-gray-500">/mo</span>
                            </div>
                            {plan.renewal_price && (
                                <p className="text-sm text-gray-500 mb-4">{plan.renewal_price}</p>
                            )}
                            <ul className="space-y-2 mb-6 flex-1">
                                {(plan.features || []).map((f: any, j: number) => (
                                    <li key={j} className="flex items-start gap-2 text-sm">
                                <svg className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#50c1ed' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span><strong>{f.highlight}</strong>{f.detail}</span>
                                    </li>
                                ))}
                            </ul>
                            {plan.order_link && (
                                <a href={plan.order_link}
                                    className="mt-auto text-center py-2 px-4 rounded-md font-semibold text-sm transition-colors"
                                    style={plan.is_recommended
                                        ? { backgroundColor: '#50c1ed', color: '#fff' }
                                        : { backgroundColor: '#f3f4f6', color: '#1f2937' }}>
                                    Order Now
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function FeaturesGrid({ s }: { s: any }) {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-[1200px] mx-auto px-6">
                {s.title && <h2 className="text-3xl font-bold text-center mb-4">{s.title}</h2>}
                {s.subtitle && <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">{s.subtitle}</p>}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {(s.items || []).map((item: any, i: number) => (
                        <div key={i} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                            {item.icon && (
                                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                                    style={{ backgroundColor: '#e8f8fd' }}
                                    dangerouslySetInnerHTML={{ __html: item.icon }} />
                            )}
                            <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function SpeedGrowth({ s }: { s: any }) {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        {s.title && <h2 className="text-3xl font-bold mb-4">{s.title}</h2>}
                        {s.subtitle && <p className="text-gray-600 mb-10">{s.subtitle}</p>}
                        <div className="space-y-6">
                            {(s.features || []).map((f: any, i: number) => (
                                <div key={i} className="flex gap-4">
                                    {f.icon && (
                                        <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                                            style={{ backgroundColor: '#e8f8fd' }}
                                            dangerouslySetInnerHTML={{ __html: f.icon }} />
                                    )}
                                    <div>
                                        <h3 className="font-semibold mb-1">{f.title}</h3>
                                        <p className="text-gray-600 text-sm">{f.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="text-center p-16 rounded-full border-2" style={{ borderColor: 'rgba(80,193,237,0.2)' }}>
                            <div className="text-6xl font-bold mb-2" style={{ color: '#50c1ed' }}>{s.uptime_percentage}</div>
                            <div className="text-gray-500 font-medium">{s.uptime_label}</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

async function SecuritySection({ s }: { s: any }) {
    const imgUrl = await resolveImage(s.image);
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/3]" style={{ backgroundColor: '#0a2540' }}>
                        {imgUrl && <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url('${imgUrl}')` }} />}
                        <div className="absolute inset-0 flex items-center justify-center text-center text-white p-8">
                            <div>
                                <svg className="w-20 h-20 mx-auto mb-6" style={{ color: '#50c1ed' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                {s.overlay_title && <h3 className="text-2xl font-bold mb-2">{s.overlay_title}</h3>}
                                {s.overlay_subtitle && <p className="text-white/70">{s.overlay_subtitle}</p>}
                            </div>
                        </div>
                    </div>
                    <div>
                        {s.title && <h2 className="text-3xl font-bold mb-4">{s.title}</h2>}
                        {s.subtitle && <p className="text-gray-600 mb-10">{s.subtitle}</p>}
                        <div className="space-y-3">
                            {(s.security_features || []).map((f: any, i: number) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-[#e8f8fd] hover:bg-[#d0f0fa] transition-colors">
                                    {f.icon && <div className="shrink-0" dangerouslySetInnerHTML={{ __html: f.icon }} />}
                                    <span className="font-medium">{f.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function SustainabilitySection({ s }: { s: any }) {
    return (
        <section className="py-16 bg-[#0a2540]/5 relative overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="text-center mb-16">
                    {s.top_label && (
                        <div className="inline-flex items-center gap-2 bg-[#50c1ed]/10 text-[#50c1ed] px-4 py-2 rounded-full text-sm font-medium mb-6">
                            {s.top_label}
                        </div>
                    )}
                    {s.title && <h2 className="text-3xl font-bold mb-4">{s.title}</h2>}
                    {s.subtitle && <p className="text-gray-600 max-w-2xl mx-auto">{s.subtitle}</p>}
                </div>
                {(s.energy_sources || []).length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
                        {s.energy_sources.map((src: any, i: number) => (
                            <div key={i} className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm">
                                {src.icon && <div className="w-14 h-14 rounded-full bg-[#50c1ed]/10 flex items-center justify-center mb-4"
                                    dangerouslySetInnerHTML={{ __html: src.icon }} />}
                                <span className="text-sm font-medium">{src.title}</span>
                            </div>
                        ))}
                    </div>
                )}
                {(s.stats || []).length > 0 && (
                    <div className="grid md:grid-cols-3 gap-8 bg-white rounded-2xl p-8 shadow-lg">
                        {s.stats.map((stat: any, i: number) => (
                            <div key={i} className="text-center">
                                <div className="text-4xl font-bold text-[#50c1ed] mb-2">{stat.value}</div>
                                <div className="text-gray-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

function SupportSection({ s }: { s: any }) {
    return (
        <section className="py-16 text-white" style={{ backgroundColor: '#0a2540' }}>
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        {s.title && <h2 className="text-3xl font-bold mb-4">{s.title}</h2>}
                        {s.subtitle && <p className="mb-10" style={{ color: 'rgba(255,255,255,0.7)' }}>{s.subtitle}</p>}
                        <div className="space-y-6 mb-10">
                            {(s.support_features || []).map((f: any, i: number) => (
                                <div key={i} className="flex gap-4">
                                    {f.icon && <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center shrink-0"
                                        dangerouslySetInnerHTML={{ __html: f.icon }} />}
                                    <div>
                                        <h3 className="font-semibold mb-1">{f.title}</h3>
                                        <p className="text-white/60 text-sm">{f.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {s.button_text && s.button_link && (
                            <a href={s.button_link}
                                className="inline-flex items-center px-8 py-3 bg-[#50c1ed] text-white font-semibold rounded-md hover:bg-[#3dafd9] transition-colors">
                                {s.button_text}
                            </a>
                        )}
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="w-72 h-72 rounded-full bg-white/5 flex items-center justify-center">
                            <div className="text-center">
                                <svg className="w-20 h-20 text-[#50c1ed] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <div className="text-3xl font-bold">24/7</div>
                                <div className="text-white/70">Human Support</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function FeaturesGrid2({ s }: { s: any }) {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-[1200px] mx-auto px-6">
                {s.main_title && <h2 className="text-3xl font-bold text-center mb-4">{s.main_title}</h2>}
                {s.subtitle && <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">{s.subtitle}</p>}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(s.items || []).map((item: any, i: number) => (
                        <div key={i} className="p-8 rounded-2xl border border-gray-200 hover:border-[#50c1ed]/30 hover:shadow-lg transition-all group">
                            {item.icon && (
                                <div className="w-14 h-14 rounded-xl bg-[#e8f8fd] group-hover:bg-[#50c1ed]/10 flex items-center justify-center mb-6 transition-colors"
                                    dangerouslySetInnerHTML={{ __html: item.icon }} />
                            )}
                            <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function TrustSection({ s }: { s: any }) {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        {s.title && <h2 className="text-3xl font-bold mb-4">{s.title}</h2>}
                        {s.subtitle && <p className="text-gray-600 mb-10">{s.subtitle}</p>}
                        <div className="space-y-4">
                            {(s.trust_items || []).map((item: any, i: number) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-white shadow-sm">
                                    {item.icon && <div className="w-10 h-10 rounded-full bg-[#50c1ed]/10 flex items-center justify-center shrink-0"
                                        dangerouslySetInnerHTML={{ __html: item.icon }} />}
                                    <span className="font-medium">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-8 shadow-sm flex items-center justify-center min-h-[300px]">
                        <div className="text-center">
                            <div className="flex justify-around gap-8 text-sm">
                                {[{ label: 'Jönköping', color: '#50c1ed' }, { label: 'Växjö', color: '#22c55e' }, { label: 'Helsingborg', color: '#50c1ed' }].map((loc, i) => (
                                    <div key={i} className="text-center">
                                        <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: loc.color }} />
                                        <span className="font-medium text-gray-700">{loc.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function FaqSection({ s }: { s: any }) {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-[1200px] mx-auto px-6">
                {s.faq_main_title && <h2 className="text-3xl font-bold mb-4">{s.faq_main_title}</h2>}
                {s.faq_sub_title && <p className="text-gray-600 max-w-2xl mx-auto text-center mb-12">{s.faq_sub_title}</p>}
                <div className="max-w-3xl mx-auto space-y-4">
                    {(s.faqs || []).map((faq: any, i: number) => (
                        <details key={i} className="bg-white rounded-lg px-6 border border-gray-200 group">
                            <summary className="flex items-center justify-between py-4 font-semibold cursor-pointer transition-colors list-none"
                                style={{ color: 'inherit' }}
                                onMouseEnter={e => (e.currentTarget.style.color = '#50c1ed')}
                                onMouseLeave={e => (e.currentTarget.style.color = 'inherit')}>
                                {faq.faq_title}
                                <svg className="w-5 h-5 shrink-0 ml-4" style={{ transition: 'transform 0.2s' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>
                            <div className="pb-4 text-sm leading-relaxed" style={{ color: '#4b5563' }}>
                                {faq.faq_content}
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CtaSection({ s }: { s: any }) {
    return (
        <section className="py-16 relative overflow-hidden" style={{ backgroundColor: '#50c1ed' }}>
            <div className="max-w-[1200px] mx-auto px-6 text-center relative">
                {s.title && <h2 className="text-3xl font-bold text-white mb-6 max-w-3xl mx-auto" style={{ fontSize: 'clamp(1.875rem, 4vw, 2.5rem)' }}>{s.title}</h2>}
                {s.text && <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.8)' }}>{s.text}</p>}
                <div className="flex flex-wrap gap-4 justify-center">
                    {s.button_text && s.button_link && (
                        <a href={s.button_link}
                            className="inline-flex items-center justify-center px-10 py-3 bg-white font-semibold rounded-md transition-colors"
                            style={{ color: '#50c1ed' }}>
                            {s.button_text}
                        </a>
                    )}
                    {s.phone_button_text && s.phone_button_link && (
                        <a href={s.phone_button_link}
                            className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-md transition-colors">
                            {s.phone_button_text}
                        </a>
                    )}
                </div>
                {s.footer_text && <p className="text-sm mt-8" style={{ color: 'rgba(255,255,255,0.6)' }}>{s.footer_text}</p>}
            </div>
        </section>
    );
}

// ─── Main dispatcher ────────────────────────────────────────────────────────

export default async function FlexibleContent({ page }: { page: any }) {
    const sections: any[] = page?.acf?.page_sections || [];

    if (!sections.length) {
        return (
            <main className="site-main py-20 text-center text-gray-500">
                <p>No content sections found.</p>
            </main>
        );
    }

    // Pre-resolve async sections (security needs image)
    const rendered = await Promise.all(
        sections.map(async (s: any, i: number) => {
            switch (s.acf_fc_layout) {
                case 'hero_section':
                    return <HeroSection key={i} s={s} />;
                case 'pricing_section':
                    return <PricingSection key={i} s={s} />;
                case 'features_grid':
                    return <FeaturesGrid key={i} s={s} />;
                case 'speed_growth':
                    return <SpeedGrowth key={i} s={s} />;
                case 'security_section':
                    return <SecuritySection key={i} s={s} />;
                case 'sustainability_section':
                    return <SustainabilitySection key={i} s={s} />;
                case 'support_section':
                    return <SupportSection key={i} s={s} />;
                case 'features_grid_2':
                    return <FeaturesGrid2 key={i} s={s} />;
                case 'trust_section':
                    return <TrustSection key={i} s={s} />;
                case 'faq_section':
                    return <FaqSection key={i} s={s} />;
                case 'cta_section':
                    return <CtaSection key={i} s={s} />;
                default:
                    return null;
            }
        })
    );

    return <main className="flexible-content-page">{rendered}</main>;
}
