import { Sheet } from './Sheet'
import type { Dog } from '../state'

/**
 * Once a dog is saved, "For" is a choice between dogs — not the questionnaire again.
 * The questionnaire is only reached by adding a dog, or by editing one from here.
 */
export function DogPicker({
  dogs,
  activeId,
  summaryLine,
  onChoose,
  onEdit,
  onAdd,
  onDismiss,
}: {
  dogs: Dog[]
  activeId: string | null
  summaryLine: (dog: Dog) => string
  onChoose: (id: string) => void
  onEdit: (id: string) => void
  onAdd: () => void
  onDismiss: () => void
}) {
  return (
    <Sheet onDismiss={onDismiss}>
      <div className="stack" style={{ gap: 4, paddingBottom: 12 }}>
        <span className="t-heading-18">Which dog is this walk for?</span>
        <span className="t-body-12 muted">Their profile decides who gets shown.</span>
      </div>

      <div className="stack" style={{ gap: 8, maxHeight: 300, overflowY: 'auto' }}>
        {dogs.map((dog) => {
          const active = dog.id === activeId
          return (
            <div key={dog.id} className="dogrow" data-active={active || undefined}>
              <button className="dogrow__main" onClick={() => onChoose(dog.id)}>
                {dog.photo ? (
                  <img className="dogrow__photo" src={dog.photo} alt="" />
                ) : (
                  <span className="dogrow__photo dogrow__photo--empty t-title-14">
                    {dog.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="stack grow" style={{ gap: 2, textAlign: 'left' }}>
                  <span className="t-title-14">{dog.name}</span>
                  <span className="t-body-11 dogrow__sub">{summaryLine(dog) || 'Profile saved'}</span>
                </span>
                {active ? <span className="t-title-14">✓</span> : null}
              </button>
              <button className="dogrow__edit t-label-11" onClick={() => onEdit(dog.id)}>
                Edit
              </button>
            </div>
          )
        })}

        <button className="dogadd" onClick={onAdd}>
          <span className="dogadd__plus">+</span>
          <span className="stack" style={{ gap: 1, textAlign: 'left' }}>
            <span className="t-title-14">Add another dog</span>
            <span className="t-body-11 muted">Nine questions, once</span>
          </span>
        </button>
      </div>
    </Sheet>
  )
}
