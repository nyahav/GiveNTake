import styles from './InterestsSelection.module.css'
import { Button } from 'flowbite-react'
import { useController } from 'react-hook-form'
import { CATEGORIES } from '../../../utils/staticData'

const InterestsSelection = ({ name, control }) => {
  const {
    field,
    fieldState: { error }
  } = useController({ name, control })

  const handleSelectedInterest = btnVal => {
    const newSelectedInterests = [...field.value] // Create a copy

    if (newSelectedInterests.includes(btnVal)) {
      newSelectedInterests.splice(newSelectedInterests.indexOf(btnVal), 1)
    } else {
      newSelectedInterests.push(btnVal)
    }

    field.onChange(newSelectedInterests)
  }

  return (
    <>
      <div className={styles.interestsSelection}>
        <div className={styles.gridContainer}>
          {Object.entries(CATEGORIES)
            .slice(1)
            .map(([categoryId, category]) => {
              return (
                <Button
                  key={categoryId}
                  color="lightgrey"
                  onClick={() => handleSelectedInterest(categoryId)}
                  className={`${styles.interestButton} ${
                    field.value.includes(categoryId) ? styles.selectedButton : ''
                  }`}>
                  <div className={styles.buttonIcon}>
                    <category.icon />
                  </div>
                  {category.name}
                </Button>
              )
            })}
        </div>
      </div>
      {error?.message && <span className="error">{error?.message}</span>}
    </>
  )
}

export default InterestsSelection
