export const getBadgeColor = (status: string, noMargin: boolean = false) => {
  let color = 'clickable'

  if (status === 'Processing') {
    color += ' bg-info'
  } else if (status === 'Done') {
    color += ' bg-success'
  } else {
    color += ' bg-error'
  }

  if (!noMargin) {
    color += ' ml-20 mr-20'
  }

  return color;
}