import { CONSENSUS_METHOD_CARD } from '@/utils'
import { AppLink } from '@/components'

const features = [
  {
    title: 'Keyboard Navigation',
    description:
      'Most of our website can be navigated using standard keyboard commands, allowing users who cannot use a mouse to access all key content and controls.'
  },
  {
    title: 'Alt Text for Images',
    description:
      'Images on our website are accompanied by descriptive alternative text so that screen readers can convey their meaning to visually impaired users.'
  },
  {
    title: 'Colour Contrast',
    description:
      'We maintain sufficient colour contrast throughout our website to ensure readability for users with low vision or colour blindness, in both light and dark modes.'
  },
  {
    title: 'Resizable Text',
    description:
      'Users can adjust text size and font styles using browser settings, allowing for greater readability and customisation without loss of content or functionality.'
  }
]

const sections = [
  {
    heading: 'Feedback',
    body: (
      <>
        We welcome feedback on the accessibility of our website. If you encounter
        any accessibility barriers or have suggestions for improvement, please
        contact us at{' '}
        <AppLink href="mailto:edi@ed.ac.uk" target="_self">
          edi@ed.ac.uk
        </AppLink>
        . We are committed to addressing and resolving accessibility issues
        promptly.
      </>
    )
  },
  {
    heading: 'Accessibility Compliance',
    body: 'Our team regularly evaluates our website to ensure compliance with accessibility standards. While we strive to adhere to WCAG guidelines, we recognise that achieving full accessibility may be an ongoing process. We are dedicated to continually improving the accessibility of our digital products and services.'
  },
  {
    heading: 'Statement Updates',
    body: 'This Accessibility Statement will be reviewed and updated regularly to reflect any changes in accessibility features or standards. The last update to this statement was on March 22, 2024.'
  },
  {
    heading: 'Contact',
    body: (
      <>
        If you have any questions or concerns about the accessibility of our
        website, please contact us at{' '}
        <AppLink href="mailto:edi@ed.ac.uk" target="_self">
          edi@ed.ac.uk
        </AppLink>
        .
      </>
    )
  }
]

export function AccessibilityStatement() {
  return (
    <div className="space-y-6">

      {/* Hero intro — matches MethodologyCard pattern */}
      <div className="card border border-base-300 shadow-sm overflow-hidden bg-base-100">
        <figure className="w-full h-36 sm:h-44 overflow-hidden bg-base-200 shrink-0">
          <img
            src={CONSENSUS_METHOD_CARD}
            alt="Accessibility"
            className="w-full h-full object-cover"
          />
        </figure>
        <div className="px-5 py-4 sm:px-6 border-b border-base-300">
          <p className="text-[10px] font-mono font-semibold text-base-content/40 uppercase tracking-[0.18em] mb-1">
            Commitment & Standards
          </p>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-base-content leading-tight">
            Accessibility Statement
          </h1>
        </div>
        <div className="px-5 py-5 sm:px-6">
          <p className="text-sm text-base-content/70 leading-relaxed">
            This website is run by the School of Informatics and is committed to
            ensuring accessibility of its digital products and services to all
            users, including those with disabilities. We strive to adhere to the{' '}
            <strong className="font-semibold text-base-content/90">
              Web Content Accessibility Guidelines (WCAG) 2.1 at the AA level
            </strong>{' '}
            to provide an inclusive and accessible experience for all visitors.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="card border border-base-300 shadow-sm overflow-hidden bg-base-100">
        <div className="px-4 py-2.5 bg-base-200/50 border-b border-base-300">
          <h2 className="text-sm font-semibold text-base-content">
            Accessibility Features
          </h2>
        </div>
        <ul className="divide-y divide-base-200">
          {features.map((f) => (
            <li key={f.title} className="px-5 py-4 sm:px-6 flex flex-col gap-1">
              <p className="text-sm font-semibold text-base-content">{f.title}</p>
              <p className="text-sm text-base-content/65 leading-relaxed">
                {f.description}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Policy sections */}
      <div className="card border border-base-300 shadow-sm overflow-hidden bg-base-100">
        {sections.map((s, i) => (
          <div key={s.heading}>
            <div className="px-4 py-2.5 bg-base-200/50 border-b border-base-300">
              <h2 className="text-sm font-semibold text-base-content">
                {s.heading}
              </h2>
            </div>
            <div
              className={`px-5 py-4 sm:px-6 sm:py-5 text-sm text-base-content/70 leading-relaxed${i < sections.length - 1 ? ' border-b border-base-300' : ''}`}
            >
              {s.body}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
