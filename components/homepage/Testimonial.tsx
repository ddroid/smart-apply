import Image from "next/image";

export function Testimonial() {
  return (
    <section className="w-full py-24 px-6 bg-surface flex flex-col items-center justify-center border-t border-border">
      <div className="max-w-[760px] text-center flex flex-col items-center gap-6">
        {/* Category Badge */}
        <span className="text-xs font-bold text-accent tracking-wider uppercase">
          Success Stories
        </span>

        {/* Quote */}
        <blockquote className="text-xl sm:text-2xl font-medium text-text-primary leading-relaxed">
          “I used to spend my evenings copy-pasting resumes. Now I open my
          dashboard to see interviews waiting. It feels like cheating. Had 3
          offers on the table simultaneously.”
        </blockquote>

        {/* User profile */}
        <div className="flex items-center gap-3 mt-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border shadow-sm">
            <Image
              src="/images/user-icon.png"
              alt="Tom Wilson - Junior Developer"
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-semibold text-text-primary">
              Tom Wilson
            </h4>
            <p className="text-xs text-text-muted font-light">
              Junior Developer
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
