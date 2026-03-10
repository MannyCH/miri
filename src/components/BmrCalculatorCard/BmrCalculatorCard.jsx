import React, { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { UnitField } from '../UnitField/UnitField';
import { RadioButton } from '../RadioButton/RadioButton';
import { Button } from '../Button/Button';
import './BmrCalculatorCard.css';

const GENDER_OPTIONS = [
  { value: 'male', label: 'male' },
  { value: 'female', label: 'female' },
];

function calculateBmr({ weightKg, heightCm, gender }) {
  const weight = parseFloat(weightKg);
  const height = parseFloat(heightCm);
  if (!weight || !height || !gender) return null;
  // Mifflin-St Jeor equation (without age, using average age assumption)
  if (gender === 'male') return Math.round(10 * weight + 6.25 * height - 5 * 30 + 5);
  return Math.round(10 * weight + 6.25 * height - 5 * 30 - 161);
}

export function BmrCalculatorCard({ onSave }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState('');
  const expandedRef = useRef(null);
  const cardRef = useRef(null);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleAnimationComplete = () => {
    if (isExpanded) {
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  const handleSave = () => {
    const bmr = calculateBmr({ weightKg: weight, heightCm: height, gender });
    if (onSave) onSave({ bmr, weight, height, gender });
    setIsExpanded(false);
  };

  const canCalculate = weight && height && gender;

  return (
    <div className="bmr-card" ref={cardRef}>
      <p className="bmr-card-question text-body-small-regular">
        Not sure how much kcal you need?
      </p>
      <button
        type="button"
        className="bmr-card-link text-body-small-bold-underlined"
        onClick={handleToggle}
        aria-expanded={isExpanded}
      >
        Calculate from height &amp; weight
      </button>

      <AnimatePresence initial={false}>
        {isExpanded ? (
          <motion.div
            ref={expandedRef}
            className="bmr-card-expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: 'auto',
              opacity: 1,
              transition: { type: 'tween', duration: 0.32, ease: [0.4, 0, 0.2, 1] },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: { type: 'tween', duration: 0.25, ease: [0.4, 0, 1, 1] },
            }}
            onAnimationComplete={handleAnimationComplete}
          >
            <div className="bmr-card-fields">
              <UnitField
                label="Weight"
                unit="kg"
                value={weight}
                onChange={setWeight}
                min={0}
              />
              <UnitField
                label="Height"
                unit="cm"
                value={height}
                onChange={setHeight}
                min={0}
              />
              <div className="bmr-card-gender" role="group" aria-labelledby="bmr-gender-label">
                <span id="bmr-gender-label" className="bmr-card-gender-label text-body-small-regular">
                  Gender
                </span>
                {GENDER_OPTIONS.map((opt) => (
                  <RadioButton
                    key={opt.value}
                    label={opt.label}
                    value={opt.value}
                    name="bmr-gender"
                    checked={gender === opt.value}
                    onChange={setGender}
                  />
                ))}
              </div>
            </div>

            <Button
              variant="secondary"
              onClick={handleSave}
              disabled={!canCalculate}
            >
              Save and close
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

BmrCalculatorCard.displayName = 'BmrCalculatorCard';
