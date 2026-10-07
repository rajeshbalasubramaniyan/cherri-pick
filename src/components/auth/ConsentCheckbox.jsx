export default function ConsentCheckbox({ checked, onChange }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 w-5 h-5 rounded border-gray-300 text-cherry focus:ring-cherry accent-cherry"
      />
      <span className="text-sm text-gray-600 font-body leading-relaxed">
        I am the parent or legal guardian of the child who will use CHERRI PICK. I consent to the collection and use of my child's learning data as described in the{' '}
        <a href="https://cherri.group/privacy" target="_blank" rel="noopener noreferrer" className="text-cherry font-semibold hover:underline">
          Privacy Policy
        </a>{' '}
        and agree to the{' '}
        <a href="https://cherri.group/terms" target="_blank" rel="noopener noreferrer" className="text-cherry font-semibold hover:underline">
          Terms and Conditions
        </a>.
      </span>
    </label>
  )
}
