export const getPlayerHash = (playerName) => {
  let hash = 0
  for(let i = 0; i < playerName.length; i++) {
    hash = playerName.charCodeAt(i) + ((hash << 5) - hash)
  }

  return hash
}

export const getPlayerHashRGB = (playerName) => {
  let color = (getPlayerHash(playerName) & 0x00FFFFFF).toString(16).toUpperCase()

  return '00000'.substring(0, 6 - color.length) + color
}