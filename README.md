# read-it

> A customizable web component that will read content out to you using the web speech API. It uses only Light DOM.
>
> This is a more customizable version of [read-it-to-me](https://github.com/macdonst/read-it-to-me) by [macdonst](https://simonmacdonald.com). See his [blog post](https://simonmacdonald.com/blog/posts/2024-02-01-read-it-to-me-component) for more information and background.

## Including the component to an HTML file

1. Import custom element:

### Unpkg

```html
<script
	type="module"
	src="https://unpkg.com/@mariohamann/read-it/read-it.js?module=true"
></script>
```

### Skypack

```html
<script
	type="module"
	src="https://cdn.skypack.dev/@mariohamann/read-it"
></script>
```

2. Start using it!

```html
<read-it>
	Read it to me!
	<button data-read-it="play">Play / Pause</button>
	<button data-read-it="stop">Stop</button>
</read-it>
```

## Including the component from NPM

1. Install `read-it` NPM package:

```console
npm i read-it
```

2. Import custom element:

```javascript
import { ReadIt } from "read-it";
```

3. Include that `script` tag in your HTML.
4. Start using it:

```html
<read-it>
	Read it to me!
	<button data-read-it="play">Play / Pause</button>
	<button data-read-it="stop">Stop</button>
</read-it>
```

## Attributes

-   `lang` - A string representing a BCP 47 language tag, with the default of `en-US`. **The default will be automatically reflected**.
-   `pitch` - A float representing the pitch value. It can range between 0 (lowest) and 2 (highest), with 1 being the default pitch for the current platform or voice.
-   `rate` - A float representing the rate value. It can range between 0.1 (lowest) and 10 (highest), with 1 being the default rate for the current platform or voice, which should correspond to a normal speaking rate.
-   `play-query` – A string representing the query selector for the play button. Defaults to `button[data-read-it="play"]`.
-   `stop-query` – A string representing the query selector for the stop button. Defaults to `button[data-read-it="stop"]`.

## States

The following states are reflected as attributes:

-   `hydrated` – A (non-settable) boolean representing the initialized state of the component.
-   `playing` – A (non-settable) boolean representing the playing state of the component.
-   `paused` – A (non-settable) boolean representing the paused state of the component.

## Events

-   `read-it-play` – Fired when the reading started or resumed.
-   `read-it-stop` – Fired when the reading stopped.
-   `read-it-pause` – Fired when the reading is paused.

## Customization

### Skip Parts

You can skip parts to be read by setting `data-read-it="skip"` to the element.

```html
<read-it>
	<p>Read this to me!</p>
	<p data-read-it="skip">Don't read this to me!</p>
</read-it>
```

### Progressive Enhancement: Ensure JavaScript availability

You can hide the play and stop buttons by default and show them when JavaScript is available by using the `hidden` and watching for the `hydrated` attribute which is set when the component is initialized.

```html
<read-it>
	<p>Read it to me! The quick brown fox jumps over the lazy dog.</p>
	<p data-read-it="skip">This content will be skipped from reading.</p>
	<button data-read-it="play" hidden>
		<span class="play">Play</span>
		<span class="pause">Pause</span>
	</button>
	<button data-read-it="stop" hidden>Stop</button>
</read-it>

<style>
	read-it[hydrated] button[data-read-it] {
		display: block;
	}
</style>
```

### Styling depending on `hydrated` / `playing` / `paused` states

You can customize styles or content depending on the `hydrated`, `playing` and the `paused` states which are reflected as attributes. The following example shows how to toggle `play` and `pause` text and the visibility of the stop button:

-   Buttons are hidden by default and shown when the component is initialized.
-   The `stop` button is shown when the component is playing or paused.
-   The `play` text is shown when the component is not playing, the `pause` text is shown when the component is playing.

```html
<read-it>
	<p>Read it to me! The quick brown fox jumps over the lazy dog.</p>
	<p data-read-it="skip">This content will be skipped from reading.</p>
	<button data-read-it="play" hidden>
		<span class="play">Play</span>
		<span class="pause">Pause</span>
	</button>
	<button data-read-it="stop" hidden>Stop</button>
</read-it>

<style>
	read-it[hydrated] button[data-read-it="play"],
	read-it:is([playing], [paused]) button[data-read-it="stop"] {
		display: block;
	}

	read-it:not([playing]) .pause,
	read-it[playing] .play {
		display: none;
	}

	read-it:not([playing]) .play,
	read-it[playing] .pause {
		display: inline-block;
	}
</style>
```
