import {display, fig} from "../_util"

import {
  ColorBar, LinearAxis,
  ColorMapper, LinearColorMapper, LogColorMapper, EqHistColorMapper, CategoricalColorMapper,
} from "@bokehjs/models"

import {Random} from "@bokehjs/core/util/random"
import {range} from "@bokehjs/core/util/array"
import {Side} from "@bokehjs/core/enums"
import {Viridis11, Spectral11} from "@bokehjs/api/palettes"

describe("ColorBar annotation", () => {
  it(`should support various combinations of locations and orientations`, async () => {
    const random = new Random(1)

    const p = fig([600, 600], {border_fill_color: "azure"})
    p.add_layout(new LinearAxis(), "above")
    p.add_layout(new LinearAxis(), "right")

    const x = range(0, 10)
    const y0 = random.floats(10)
    const y1 = random.floats(10)
    const y2 = random.floats(10)

    p.circle(x, y0, {fill_color: "red"})

    p.circle(x, y1, {fill_color: "blue"})
    p.line(x, y1, {line_color: "orange"})

    p.circle(x, y2, {fill_color: "green"})

    const color_bar = (attrs: Partial<ColorBar.Attrs>) => {
      const color_mapper = new LinearColorMapper({palette: Viridis11, low: -2, high: 5})
      return new ColorBar({color_mapper, background_fill_color: "lightgray", background_fill_alpha: 0.7, ...attrs})
    }

    p.add_layout(color_bar({orientation: "horizontal"}), "above")
    p.add_layout(color_bar({orientation: "horizontal", width: 100}), "above")

    p.add_layout(color_bar({orientation: "horizontal"}), "below")
    p.add_layout(color_bar({orientation: "horizontal", width: 100}), "below")

    p.add_layout(color_bar({orientation: "vertical"}), "left")
    p.add_layout(color_bar({orientation: "vertical", height: 100}), "left")

    p.add_layout(color_bar({orientation: "vertical"}), "right")
    p.add_layout(color_bar({orientation: "vertical", height: 100}), "right")

    /*
    p.add_layout(color_bar({location: "center_left", orientation: "vertical"}))
    p.add_layout(color_bar({location: "center", orientation: "vertical"}))
    p.add_layout(color_bar({location: "top_center", orientation: "horizontal"}))
    p.add_layout(color_bar({location: "top_right", orientation: "horizontal"}))
    p.add_layout(color_bar({location: "bottom_right", orientation: "horizontal"}))
    */
    //p.add_layout(color_bar({location: [0, 0], orientation: "vertical"}))

    await display(p)
  })

  function make_plot(color_mapper: ColorMapper, color_bar: ColorBar, side: Side) {
    const random = new Random(1)

    const horizontal = side == "above" || side == "below"
    const n = 30
    const [a, b] = horizontal ? [10, 5] : [5, 10]
    const x = random.floats(n, 0, a)
    const y = random.floats(n, 0, b)
    const r = random.floats(n, 0.1, 0.5)
    const v = random.floats(n, 0, 100)

    const [l, s] = [500, 200]
    const p = (() => {
      if (horizontal)
        return fig([l, s], {x_axis_location: side})
      else
        return fig([s, l], {y_axis_location: side})
    })()
    p.circle({x, y, radius: r, fill_color: {field: "values", transform: color_mapper}, source: {values: v}})
    p.add_layout(color_bar, side)
    return p
  }

  it(`should allow to be placed above frame in horizontal (auto) orientation`, async () => {
    const color_mapper = new LinearColorMapper({palette: Spectral11})
    const color_bar = new ColorBar({color_mapper, padding: 0})
    const p = make_plot(color_mapper, color_bar, "above")
    await display(p)
  })

  it(`should allow to be placed above frame in horizontal (auto) orientation with height=50px`, async () => {
    const color_mapper = new LinearColorMapper({palette: Spectral11})
    const color_bar = new ColorBar({color_mapper, height: 50})
    const p = make_plot(color_mapper, color_bar, "above")
    await display(p)
  })

  it(`should allow to be placed above frame in vertical orientation`, async () => {
    const color_mapper = new LinearColorMapper({palette: Spectral11})
    const color_bar = new ColorBar({color_mapper, orientation: "vertical", width: 200, height: 100})
    const p = make_plot(color_mapper, color_bar, "above")
    await display(p)
  })

  it(`should allow to be placed below frame in horizontal (auto) orientation`, async () => {
    const color_mapper = new LinearColorMapper({palette: Spectral11})
    const color_bar = new ColorBar({color_mapper, padding: 0})
    const p = make_plot(color_mapper, color_bar, "below")
    await display(p)
  })

  it(`should allow to be placed below frame in horizontal (auto) orientation with height=50px`, async () => {
    const color_mapper = new LinearColorMapper({palette: Spectral11})
    const color_bar = new ColorBar({color_mapper, height: 50})
    const p = make_plot(color_mapper, color_bar, "below")
    await display(p)
  })

  it(`should allow to be placed below frame in vertical orientation`, async () => {
    const color_mapper = new LinearColorMapper({palette: Spectral11})
    const color_bar = new ColorBar({color_mapper, orientation: "vertical", width: 200, height: 100})
    const p = make_plot(color_mapper, color_bar, "below")
    await display(p)
  })

  it(`should allow to be placed left of frame in vertical (auto) orientation`, async () => {
    const color_mapper = new LinearColorMapper({palette: Spectral11})
    const color_bar = new ColorBar({color_mapper, padding: 0})
    const p = make_plot(color_mapper, color_bar, "left")
    await display(p)
  })

  it(`should allow to be placed left of frame in vertical (auto) orientation with width=50px`, async () => {
    const color_mapper = new LinearColorMapper({palette: Spectral11})
    const color_bar = new ColorBar({color_mapper, width: 50})
    const p = make_plot(color_mapper, color_bar, "left")
    await display(p)
  })

  it(`should allow to be placed left of frame in horizontal orientation`, async () => {
    const color_mapper = new LinearColorMapper({palette: Spectral11})
    const color_bar = new ColorBar({color_mapper, orientation: "horizontal", width: 100, height: 200})
    const p = make_plot(color_mapper, color_bar, "left")
    await display(p)
  })

  it(`should allow to be placed right of frame in vertical (auto) orientation`, async () => {
    const color_mapper = new LinearColorMapper({palette: Spectral11})
    const color_bar = new ColorBar({color_mapper, padding: 0})
    const p = make_plot(color_mapper, color_bar, "right")
    await display(p)
  })

  it(`should allow to be placed right of frame in vertical (auto) orientation with width=50px`, async () => {
    const color_mapper = new LinearColorMapper({palette: Spectral11})
    const color_bar = new ColorBar({color_mapper, width: 50})
    const p = make_plot(color_mapper, color_bar, "right")
    await display(p)
  })

  it(`should allow to be placed right of frame in horizontal orientation`, async () => {
    const color_mapper = new LinearColorMapper({palette: Spectral11})
    const color_bar = new ColorBar({color_mapper, orientation: "horizontal", width: 100, height: 200})
    const p = make_plot(color_mapper, color_bar, "right")
    await display(p)
  })

  it(`should support LinearColorMapper`, async () => {
    const random = new Random(1)

    const color_mapper = new LinearColorMapper({palette: Spectral11})
    const color_bar = new ColorBar({color_mapper})

    const n = 30
    const x = random.floats(n, 0, 10)
    const y = random.floats(n, 0, 5)
    const r = random.floats(n, 0.1, 0.5)
    const v = random.floats(n, 0, 100)

    const p = fig([500, 200])
    p.circle({x, y, radius: r, fill_color: {field: "values", transform: color_mapper}, source: {values: v}})
    p.add_layout(color_bar, "below")

    await display(p)
  })

  it(`should support LogColorMapper`, async () => {
    const random = new Random(1)

    const color_mapper = new LogColorMapper({palette: Spectral11})
    const color_bar = new ColorBar({color_mapper})

    const n = 30
    const x = random.floats(n, 0, 10)
    const y = random.floats(n, 0, 5)
    const r = random.floats(n, 0.1, 0.5)
    const v = [
      ...random.floats(n/3, 7, 13),
      ...random.floats(n/3, 70, 130),
      ...random.floats(n/3, 700, 1300),
    ]

    const p = fig([500, 200])
    p.circle({x, y, radius: r, fill_color: {field: "values", transform: color_mapper}, source: {values: v}})
    p.add_layout(color_bar, "below")

    await display(p)
  })

  it(`should support EqHistColorMapper`, async () => {
    const random = new Random(1)

    const color_mapper = new EqHistColorMapper({palette: Spectral11})
    const color_bar = new ColorBar({color_mapper})

    const n = 30
    const x = random.floats(n, 0, 10)
    const y = random.floats(n, 0, 5)
    const r = random.floats(n, 0.1, 0.5)
    const v = [
      ...random.floats(n/3, 7, 13),
      ...random.floats(n/3, 70, 130),
      ...random.floats(n/3, 700, 1300),
    ]

    const p = fig([500, 200])
    p.circle({x, y, radius: r, fill_color: {field: "values", transform: color_mapper}, source: {values: v}})
    p.add_layout(color_bar, "below")

    await display(p)
  })

  it(`should support CategoricalColorMapper`, async () => {
    const random = new Random(1)

    const factors = ["foo", "bar", "baz", "qux", "quux", "corge", "grault", "garply", "waldo", "fred", "plugh"]
    const color_mapper = new CategoricalColorMapper({palette: Spectral11, factors})
    const color_bar = new ColorBar({color_mapper})

    const n = 30
    const x = random.floats(n, 0, 10)
    const y = random.floats(n, 0, 5)
    const r = random.floats(n, 0.1, 0.5)
    const v = random.choices(n, factors)

    const p = fig([500, 200])
    p.circle({x, y, radius: r, fill_color: {field: "values", transform: color_mapper}, source: {values: v}})
    p.add_layout(color_bar, "below")

    await display(p)
  })
})
