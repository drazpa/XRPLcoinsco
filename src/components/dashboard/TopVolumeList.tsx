<command>// Update the card className to include enhanced glow effects
return (
  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
    {top10Tokens.map((token, index) => (
      <div
        key={token.id}
        className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 rounded-xl p-4 shadow-[0_0_25px_rgba(59,130,246,0.15)] dark:shadow-[0_0_25px_rgba(37,99,235,0.15)] hover:shadow-[0_0_35px_rgba(59,130,246,0.25)] dark:hover:shadow-[0_0_35px_rgba(37,99,235,0.25)] border border-blue-100/50 dark:border-blue-900/50 backdrop-blur-xl transition-all duration-300"
      >
        {/* Rest of the component remains the same */}
      </div>
    ))}
  </div>
);</command>