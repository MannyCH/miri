import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw } from 'react-feather';
import { Divider } from '../../components/Divider';
import { IngredientList } from '../../components/IngredientList';
import { SearchBar } from '../../components/SearchBar';
import { Button } from '../../components/Button';
import { ShareListSheet } from '../../components/ShareListSheet/ShareListSheet';
import { NavigationBarConnected } from '../../components/NavigationBar/NavigationBarConnected';
import './ShoppingListView.css';

/**
 * ShoppingListView Pattern - Shopping list screen with ingredients
 * Composition of: IngredientList, SearchBar, Button, NavigationBar
 * Supports two view modes: list view and recipe-grouped view
 */
export const ShoppingListView = ({
  viewMode = 'list',
  items = [],
  itemKeys = [],
  itemIds = [],
  recipeGroups = [],
  checkedItems = {},
  onItemCheck,
  onItemDelete,
  onClearList,
  onViewModeChange,
  onSmartRefresh,
  onSmartItemDelete,
  smartGroups = [],
  smartStatus = 'idle',
  searchQuery = '',
  onSearch,
  summaryEntries = [],
  pantryStaples = [],
  onTogglePantryStaple,
  // Sharing
  onShare,
  onLeave,
  isSharedList = false,
  sharedListMeta = null,
  ...props
}) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [smartChecked, setSmartChecked] = useState({});

  const toggleSmartItem = (key) =>
    setSmartChecked(prev => ({ ...prev, [key]: !prev[key] }));
  const PURCHASED_SECTION_TITLE = 'Eingekauft';
  const RECIPE_REMOVE_ANIMATION_MS = 320;
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [removingRecipeKeys, setRemovingRecipeKeys] = useState({});
  const searchInputRef = useRef(null);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      setKeyboardHeight(Math.max(0, window.innerHeight - vv.offsetTop - vv.height));
    };
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, []);

  const handleFabClick = () => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    } else {
      setIsSearchOpen(true);
    }
  };

  const handleCancel = () => {
    setIsSearchOpen(false);
    onSearch?.('');
  };

  const getRecipeGroupKey = (group, index) =>
    group.recipeId ?? group.id ?? group.recipeName ?? `group-${index}`;

  const handleRecipeGroupDelete = (group, groupIndex) => {
    const groupKey = getRecipeGroupKey(group, groupIndex);
    if (removingRecipeKeys[groupKey]) return;

    setRemovingRecipeKeys(prev => ({ ...prev, [groupKey]: true }));
    window.setTimeout(() => {
      group.onDelete?.();
      setRemovingRecipeKeys(prev => {
        const next = { ...prev };
        delete next[groupKey];
        return next;
      });
    }, RECIPE_REMOVE_ANIMATION_MS);
  };

  const uncheckedItems = {
    ingredients: [],
    itemKeys: [],
    itemIds: [],
    originalIndices: [],
  };
  const checkedListItems = {
    ingredients: [],
    itemKeys: [],
    itemIds: [],
    originalIndices: [],
  };

  items.forEach((ingredient, index) => {
    const target = checkedItems[index] ? checkedListItems : uncheckedItems;
    target.ingredients.push(ingredient);
    target.itemKeys.push(itemKeys[index]);
    target.itemIds.push(itemIds[index]);
    target.originalIndices.push(index);
  });

  const splitRecipeGroupByChecked = (group) => {
    const uncheckedIndices = [];
    const checkedIndices = [];

    (group.ingredients || []).forEach((ingredient, index) => {
      const checkedValue = group.checkedItems?.[index];
      const isPantry = pantryStaples.some(s => ingredient?.toLowerCase().includes(s));
      if (checkedValue === true || isPantry) {
        checkedIndices.push(index);
      } else {
        uncheckedIndices.push(index);
      }
    });

    const createGroupFromIndices = (indices, isCheckedGroup) => {
      if (indices.length === 0) return null;
      return {
        ...group,
        ingredients: indices.map((index) => group.ingredients?.[index]),
        ingredientKeys: indices.map((index) => group.ingredientKeys?.[index]),
        ingredientIds: indices.map((index) => group.ingredientIds?.[index]),
        originalIndices: indices,
        checkedItems: indices.reduce((acc, _, nextIndex) => {
          acc[nextIndex] = isCheckedGroup;
          return acc;
        }, {}),
      };
    };

    return {
      uncheckedGroup: createGroupFromIndices(uncheckedIndices, false),
      checkedGroup: createGroupFromIndices(checkedIndices, true),
    };
  };

  const groupedSections = recipeGroups.map(splitRecipeGroupByChecked);
  const uncheckedRecipeGroups = groupedSections
    .map((group) => group.uncheckedGroup)
    .filter(Boolean);
  const checkedRecipeGroups = groupedSections
    .map((group) => group.checkedGroup)
    .filter(Boolean);

  return (
    <div
      className="shopping-list-view"
      style={{ '--keyboard-height': `${keyboardHeight}px` }}
      {...props}
    >
      {/* Header */}
      <header className="shopping-list-header">
        <h1 className="text-h1-bold">
          Shopping list
          {isSharedList && <span className="shopping-list-shared-badge text-tiny-bold">SHARED</span>}
        </h1>

        <div className="shopping-list-header-actions">
          {(onShare || isSharedList) && (
            <button
              type="button"
              className="shopping-list-share-btn"
              onClick={() => setIsShareOpen(true)}
              aria-label={isSharedList ? 'Shared list options' : 'Share list'}
            >
              <ShareIcon />
            </button>
          )}

          {/* View Mode Toggle */}
          <div className="shopping-list-view-toggle">
            <button
              className={`view-toggle-button ${viewMode === 'recipe' ? 'active' : ''}`}
              onClick={() => onViewModeChange?.('recipe')}
              aria-label="Group by recipe"
            >
              <GridIcon />
            </button>
            <button
              className={`view-toggle-button ${viewMode === 'smart' ? 'active' : ''}`}
              onClick={() => onViewModeChange?.('smart')}
              aria-label="Smart grouped list"
            >
              <SparkleIcon />
            </button>
          </div>
        </div>
      </header>

      <ShareListSheet
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        onShare={onShare}
        onLeave={onLeave}
        isSharedList={isSharedList}
        sharedListName={sharedListMeta?.name ?? null}
      />

      {/* Content */}
      <div className="shopping-list-content">
        {summaryEntries.length > 0 && (
          <div className="shopping-list-summary">
            <p className="text-body-small-bold shopping-list-summary-title">For this week</p>
            <ul className="shopping-list-summary-list">
              {summaryEntries.map(({ recipeName, servings }) => (
                <li key={recipeName} className="text-body-small-regular shopping-list-summary-item">
                  <span className="shopping-list-summary-servings">×{servings}</span>
                  <span>{recipeName}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {viewMode === 'recipe' && (
          <>
            <div className="shopping-list-recipe-groups">
              {uncheckedRecipeGroups.map((group, groupIndex) => (
                <motion.div
                  key={getRecipeGroupKey(group, groupIndex)}
                  className="recipe-group"
                  initial={false}
                  layout="position"
                  style={
                    removingRecipeKeys[getRecipeGroupKey(group, groupIndex)]
                      ? { pointerEvents: 'none', overflow: 'hidden' }
                      : { overflow: 'hidden' }
                  }
                  animate={
                    removingRecipeKeys[getRecipeGroupKey(group, groupIndex)]
                      ? { opacity: 0, height: 0, marginTop: 0, marginBottom: 0, scale: 0.98 }
                      : { opacity: 1, height: 'auto', marginTop: 0, marginBottom: 0, scale: 1 }
                  }
                  transition={{
                    duration: RECIPE_REMOVE_ANIMATION_MS / 1000,
                    ease: [0.22, 0.61, 0.36, 1],
                    layout: { type: 'spring', stiffness: 420, damping: 34, mass: 0.65 },
                  }}
                >
                  <div className="recipe-group-header">
                    <h3 className="text-body-base-bold">{group.recipeName}</h3>
                    <button
                      className="icon-button-delete"
                      onClick={() => handleRecipeGroupDelete(group, groupIndex)}
                      aria-label={`Delete ${group.recipeName}`}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                  <IngredientList
                    ingredients={group.ingredients}
                    itemKeys={group.ingredientKeys || []}
                    itemIds={group.ingredientIds || []}
                    checkedItems={group.checkedItems || {}}
                    onCheckedChange={(index, checked, itemId) =>
                      group.onIngredientCheck?.(group.originalIndices[index], checked, itemId)
                    }
                    onDelete={(index, itemId) =>
                      group.onIngredientDelete?.(group.originalIndices[index], itemId)
                    }
                    pantryStaples={pantryStaples}
                    onPantryToggle={(_, ingredient) => onTogglePantryStaple?.(ingredient?.toLowerCase())}
                  />
                </motion.div>
              ))}
            </div>
            {checkedRecipeGroups.length > 0 && (
              <>
                <h2 className="shopping-list-purchased-title text-body-small-bold">
                  {PURCHASED_SECTION_TITLE}
                </h2>
                <div className="shopping-list-recipe-groups">
                  {checkedRecipeGroups.map((group, groupIndex) => (
                    <motion.div
                      key={`purchased-${getRecipeGroupKey(group, groupIndex)}`}
                      className="recipe-group"
                      initial={false}
                      layout="position"
                      style={{ overflow: 'hidden' }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 0, marginBottom: 0, x: 0, scale: 1 }}
                      transition={{
                        duration: RECIPE_REMOVE_ANIMATION_MS / 1000,
                        ease: [0.22, 0.61, 0.36, 1],
                        layout: { type: 'spring', stiffness: 420, damping: 34, mass: 0.65 },
                      }}
                    >
                      <div className="recipe-group-header">
                        <h3 className="text-body-base-bold">{group.recipeName}</h3>
                        <button
                          className="icon-button-restore"
                          onClick={() => group.onRestore?.()}
                          aria-label={`Restore ${group.recipeName}`}
                        >
                          <RotateCcw size={20} />
                        </button>
                      </div>
                      <IngredientList
                        ingredients={group.ingredients}
                        itemKeys={group.ingredientKeys || []}
                        itemIds={group.ingredientIds || []}
                        checkedItems={group.checkedItems || {}}
                        onCheckedChange={(index, checked, itemId) =>
                          group.onIngredientCheck?.(group.originalIndices[index], checked, itemId)
                        }
                        onDelete={(index, itemId) =>
                          group.onIngredientDelete?.(group.originalIndices[index], itemId)
                        }
                        pantryStaples={pantryStaples}
                        onPantryToggle={(_, ingredient) => onTogglePantryStaple?.(ingredient?.toLowerCase())}
                      />
                    </motion.div>
                  ))}
                </div>
              </>
            )}
            {recipeGroups.length > 0 && (
              <div className="shopping-list-clear">
                <Button variant="tertiary-delete" onClick={onClearList}>
                  Clear whole list
                </Button>
              </div>
            )}
          </>
        )}

        {viewMode === 'smart' && (
          <div className="shopping-list-smart">
            {smartStatus === 'loading' && (
              <div className="shopping-list-smart-loading">
                <SparkleIcon />
                <span className="text-body-regular">Organising your list…</span>
              </div>
            )}
            {smartStatus === 'error' && (
              <div className="shopping-list-smart-error">
                <p className="text-body-regular">Could not organise list.</p>
                <button type="button" className="shopping-list-smart-retry" onClick={onSmartRefresh}>
                  Try again
                </button>
              </div>
            )}
            {smartStatus === 'idle' && smartGroups.length === 0 && (
              <p className="shopping-list-smart-empty text-body-regular">
                Your list is empty.
              </p>
            )}
            {smartStatus === 'idle' && smartGroups.length > 0 && (
              <SmartListContent
                smartGroups={smartGroups}
                smartChecked={smartChecked}
                toggleSmartItem={toggleSmartItem}
                pantryStaples={pantryStaples}
                onTogglePantryStaple={onTogglePantryStaple}
                onSmartItemDelete={onSmartItemDelete}
                onSmartRefresh={onSmartRefresh}
                PURCHASED_SECTION_TITLE={PURCHASED_SECTION_TITLE}
              />
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <NavigationBarConnected activeItem="shopping-list" />

      {/* Search overlay — slides in from top, Cancel always visible above keyboard */}
      {isSearchOpen && (
        <div className="shopping-list-search-overlay">
          <SearchBar
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            inputRef={searchInputRef}
            placeholder="Ich brauche..."
            value={searchQuery}
            onChange={(e) => onSearch?.(e.target.value)}
            showTrailingIcon={false}
          />
          <button
            type="button"
            className="shopping-list-search-cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Floating search FAB — fixed, floats above keyboard */}
      <button
        type="button"
        className="shopping-list-search-fab"
        onClick={handleFabClick}
        aria-label="Search shopping list"
      >
        <SearchIcon />
      </button>
    </div>
  );
};

/**
 * SmartListItem — tap to check/uncheck,
 * swipe RIGHT → pantry staple zone (brand colour, left side),
 * swipe LEFT  → delete zone (error colour, right side).
 */
function SmartListItem({ item, checked, isPantry, onToggle, onTogglePantryStaple, onDelete, isFirst }) {
  // positive = swiping left (delete), negative = swiping right (pantry)
  const [swipeX, setSwipeX] = React.useState(0);
  const [isSwiping, setIsSwiping] = React.useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = React.useState(false);
  const startXRef = React.useRef(0);
  const startYRef = React.useRef(0);
  const swipeDirectionRef = React.useRef(null); // 'horizontal' | 'vertical' | null

  const MAX_SWIPE = 120;
  const SWIPE_THRESHOLD = 84;
  const SWIPE_TRANSITION = '360ms cubic-bezier(0.22, 0.61, 0.36, 1)';
  const ANIMATE_OUT_MS = 320;

  const triggerDelete = React.useCallback(() => {
    if (isAnimatingOut) return;
    setSwipeX(MAX_SWIPE);
    setIsSwiping(false);
    setIsAnimatingOut(true);
    window.setTimeout(() => onDelete?.(), ANIMATE_OUT_MS);
  }, [isAnimatingOut, onDelete]);

  const triggerPantryToggle = React.useCallback(() => {
    if (isAnimatingOut) return;
    setSwipeX(-MAX_SWIPE);
    setIsSwiping(false);
    setIsAnimatingOut(true);
    window.setTimeout(() => {
      onTogglePantryStaple?.(item.name?.toLowerCase());
      setSwipeX(0);
      setIsAnimatingOut(false);
    }, ANIMATE_OUT_MS);
  }, [isAnimatingOut, item.name, onTogglePantryStaple]);

  const handleTouchStart = (e) => {
    if (isAnimatingOut) return;
    startXRef.current = e.touches[0].clientX;
    startYRef.current = e.touches[0].clientY;
    swipeDirectionRef.current = null;
    setIsSwiping(true);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping) return;
    const dx = startXRef.current - e.touches[0].clientX;
    const dy = startYRef.current - e.touches[0].clientY;

    if (swipeDirectionRef.current === null) {
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
      swipeDirectionRef.current = Math.abs(dy) > Math.abs(dx) ? 'vertical' : 'horizontal';
    }

    if (swipeDirectionRef.current === 'vertical') return;

    e.preventDefault();
    setSwipeX(Math.max(-MAX_SWIPE, Math.min(MAX_SWIPE, dx)));
  };

  const handleTouchEnd = () => {
    if (isAnimatingOut) return;
    swipeDirectionRef.current = null;
    if (swipeX > SWIPE_THRESHOLD) { triggerDelete(); return; }
    if (swipeX < -SWIPE_THRESHOLD) { triggerPantryToggle(); return; }
    setSwipeX(0);
    setIsSwiping(false);
  };

  const handleClick = () => {
    if (isSwiping || swipeX !== 0 || isAnimatingOut || isPantry) return;
    onToggle?.();
  };

  const leftProgress = Math.min(1, Math.max(0, swipeX) / MAX_SWIPE);   // left-swipe → delete
  const rightProgress = Math.min(1, Math.max(0, -swipeX) / MAX_SWIPE); // right-swipe → pantry
  const label = `${item.quantity ? item.quantity + ' ' : ''}${item.name}`;

  return (
    <motion.div
      className="smart-list-item"
      initial={false}
      layout="position"
      style={isAnimatingOut ? { pointerEvents: 'none', overflow: 'hidden' } : { overflow: 'hidden' }}
      animate={isAnimatingOut
        ? { opacity: 0, height: 0, marginTop: 0, marginBottom: 0, x: -16, scale: 0.98 }
        : { opacity: 1, height: 'auto', marginTop: 0, marginBottom: 0, x: 0, scale: 1 }}
      transition={{
        duration: ANIMATE_OUT_MS / 1000,
        ease: [0.22, 0.61, 0.36, 1],
        layout: { type: 'spring', stiffness: 420, damping: 34, mass: 0.65 },
      }}
    >
      {isFirst && <Divider />}
      <div
        className={`smart-list-item-wrapper${swipeX !== 0 ? ' is-swiping' : ''}`}
        style={{ '--left-swipe-progress': leftProgress, '--right-swipe-progress': rightProgress }}
      >
        {/* Pantry zone — sits on the LEFT, revealed by swiping RIGHT */}
        <button
          type="button"
          className="smart-list-item-pantry-zone"
          aria-label={isPantry ? `Remove ${item.name} from pantry staples` : `Mark ${item.name} as pantry staple`}
          onClick={triggerPantryToggle}
          tabIndex={rightProgress > 0 ? 0 : -1}
        >
          {isPantry ? <PantryRemoveIcon /> : <PantryIcon />}
        </button>

        {/* Delete zone — sits on the RIGHT, revealed by swiping LEFT */}
        <button
          type="button"
          className="smart-list-item-delete-zone"
          aria-label={`Delete ${label}`}
          onClick={triggerDelete}
          tabIndex={leftProgress > 0 ? 0 : -1}
        >
          <TrashIcon />
        </button>

        <div
          className={`smart-list-item-container${checked || isPantry ? ' is-checked' : ''}`}
          style={{
            transform: `translateX(${-swipeX}px)`,
            transition: isSwiping ? 'none' : `transform ${SWIPE_TRANSITION}`,
          }}
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="button"
          tabIndex={0}
          aria-pressed={checked}
          aria-label={`${checked ? 'Uncheck' : 'Check'} ${label}`}
          onKeyDown={(e) => {
            if ((e.key === ' ' || e.key === 'Enter') && !isPantry) { e.preventDefault(); onToggle?.(); }
            if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); triggerDelete(); }
          }}
        >
          <span className="smart-list-item-quantity text-body-small-regular">{item.quantity || ''}</span>
          <span className="smart-list-item-name text-body-small-regular">{item.name}</span>
          {(checked || isPantry) && <CheckSmallIcon />}
        </div>
      </div>
      <Divider />
    </motion.div>
  );
}

function SmartListContent({ smartGroups, smartChecked, toggleSmartItem, pantryStaples, onTogglePantryStaple, onSmartItemDelete, onSmartRefresh, PURCHASED_SECTION_TITLE }) {
  const allCheckedItems = [];
  const pantryItems = [];

  smartGroups.forEach((group, groupIdx) => {
    group.items.forEach((item) => {
      const key = `${groupIdx}-${item.name}`;
      const isPantry = pantryStaples.includes(item.name?.toLowerCase());
      if (isPantry) pantryItems.push({ item, key });
      else if (smartChecked[key]) allCheckedItems.push({ item, key });
    });
  });

  return (
    <>
      {smartGroups.map((group, groupIdx) => {
        const visibleItems = group.items
          .map((item) => ({ item, key: `${groupIdx}-${item.name}` }))
          .filter(({ item, key }) => !pantryStaples.includes(item.name?.toLowerCase()) && !smartChecked[key]);
        if (visibleItems.length === 0) return null;
        return (
          <div key={group.category} className="smart-group">
            <h2 className="smart-group-header text-tiny-bold">
              <span aria-hidden="true">{group.emoji}</span> {group.category.toUpperCase()}
            </h2>
            {visibleItems.map(({ item, key }, idx) => (
              <SmartListItem
                key={key}
                item={item}
                checked={false}
                isPantry={false}
                onToggle={() => toggleSmartItem(key)}
                onTogglePantryStaple={onTogglePantryStaple}
                onDelete={() => onSmartItemDelete?.(item.name)}
                isFirst={idx === 0}
              />
            ))}
          </div>
        );
      })}

      {allCheckedItems.length > 0 && (
        <div className="smart-group">
          <h2 className="smart-group-header text-tiny-bold">{PURCHASED_SECTION_TITLE.toUpperCase()}</h2>
          {allCheckedItems.map(({ item, key }, idx) => (
            <SmartListItem
              key={key}
              item={item}
              checked={true}
              isPantry={false}
              onToggle={() => toggleSmartItem(key)}
              onTogglePantryStaple={onTogglePantryStaple}
              onDelete={() => onSmartItemDelete?.(item.name)}
              isFirst={idx === 0}
            />
          ))}
        </div>
      )}

      {pantryItems.length > 0 && (
        <div className="smart-group">
          <h2 className="smart-group-header text-tiny-bold smart-group-header--pantry">PANTRY STAPLES</h2>
          {pantryItems.map(({ item, key }, idx) => (
            <SmartListItem
              key={key}
              item={item}
              checked={true}
              isPantry={true}
              onTogglePantryStaple={onTogglePantryStaple}
              onDelete={() => onSmartItemDelete?.(item.name)}
              isFirst={idx === 0}
            />
          ))}
        </div>
      )}

      <div className="shopping-list-smart-refresh">
        <button type="button" className="shopping-list-smart-retry" onClick={onSmartRefresh}>Refresh</button>
      </div>
    </>
  );
}

const PantryIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const PantryRemoveIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <line x1="9" y1="12" x2="15" y2="18"/>
    <line x1="15" y1="12" x2="9" y2="18"/>
  </svg>
);

const GridIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const ListIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    <line x1="10" y1="11" x2="10" y2="17"/>
    <line x1="14" y1="11" x2="14" y2="17"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

const SparkleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="5" x2="10" y2="5"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <line x1="3" y1="15" x2="21" y2="15"/>
    <line x1="3" y1="20" x2="10" y2="20"/>
  </svg>
);

const CheckSmallIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const ShareIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);

ShoppingListView.displayName = 'ShoppingListView';
