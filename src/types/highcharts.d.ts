declare module 'highcharts' {
  // Упрощённое описание типов, чтобы не тянуть полный d.ts
  // и не ломать сборку.
  export type Options = any

  const Highcharts: any
  export default Highcharts
}

declare module 'highcharts-react-official' {
  import type Highcharts from 'highcharts'

  interface HighchartsReactProps {
    highcharts: typeof Highcharts
    options: Highcharts.Options | any
    containerProps?: any
  }

  const HighchartsReact: (props: HighchartsReactProps) => JSX.Element
  export default HighchartsReact
}


