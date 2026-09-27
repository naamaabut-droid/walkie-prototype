import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

/**
 * Bottom sheet. Drag it down past a third of its height and it dismisses —
 * the gesture the Figma prototype could only fake with an ON_DRAG hotspot.
 */
export function Sheet({ children, onDismiss }: { children: ReactNode; onDismiss: () => void }) {
  return (
    <>
      <motion.div
        className="scrim"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.45 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onDismiss}
      />
      <motion.div
        className="sheet"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 420, damping: 38 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 90 || info.velocity.y > 600) onDismiss()
        }}
      >
        <div className="sheet__grip" />
        {children}
      </motion.div>
    </>
  )
}
