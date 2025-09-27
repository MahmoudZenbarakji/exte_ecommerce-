import { useState, createContext, useContext } from 'react'

const DialogContext = createContext()

export function Dialog({ children, open, onOpenChange }) {
  const [isOpen, setIsOpen] = useState(open || false)
  
  const handleOpenChange = (newOpen) => {
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  return (
    <DialogContext.Provider value={{ isOpen, setIsOpen: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  )
}

export function DialogTrigger({ children, asChild }) {
  const { setIsOpen } = useContext(DialogContext)
  
  if (asChild) {
    return children
  }
  
  return (
    <button onClick={() => setIsOpen(true)}>
      {children}
    </button>
  )
}

export function DialogContent({ children, className = '' }) {
  const { isOpen, setIsOpen } = useContext(DialogContext)
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
      <div className={`relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 ${className}`}>
        {children}
      </div>
    </div>
  )
}

export function DialogHeader({ children, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  )
}

export function DialogTitle({ children, className = '' }) {
  return (
    <h2 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h2>
  )
}

export function DialogDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-gray-600 mt-1 ${className}`}>
      {children}
    </p>
  )
}

export function DialogFooter({ children, className = '' }) {
  return (
    <div className={`flex justify-end space-x-2 mt-6 ${className}`}>
      {children}
    </div>
  )
}
