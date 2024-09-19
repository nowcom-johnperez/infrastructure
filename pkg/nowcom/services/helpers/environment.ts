export const getBadgeColor = (status: string) => {
  let color = 'clickable ml-20 mr-20'

  if (status === 'Processing') {
    color += ' bg-info'
  } else if (status === 'Done') {
    color += ' bg-success'
  } else {
    color += ' bg-error'
  }

  return color;
}