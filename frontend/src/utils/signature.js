import dayjs from 'dayjs'


export const generateSignature = () => {

  const ts = dayjs().unix()

  return {
    ts: Number(ts),
  }

}
