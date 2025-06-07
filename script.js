// Story data
const stories = {
    0: {
        title: "First Steps in React",
        date: "March 1, 2025",
        preview: "Starting my journey with React and discovering the beauty of component-based architecture...",
        content: `<h3>First Steps in React</h3>
        <p><strong>March 1, 2025</strong></p>
        <p>Today marked the beginning of my React journey, and I'm already fascinated by the elegance of component-based architecture. Coming from vanilla JavaScript, the concept of breaking down the UI into reusable components feels like a revelation.</p>
        <p>I spent the morning working through the official React tutorial, building a simple tic-tac-toe game. What struck me most was how naturally the data flow works with props and state. The way components can communicate with each other through props while maintaining their own internal state is beautifully designed.</p>
        <p>The hardest part was wrapping my head around JSX at first. Writing HTML-like syntax inside JavaScript felt strange initially, but after a few hours, it started to feel natural. The ability to embed JavaScript expressions directly in the markup is incredibly powerful.</p>
        <p>I'm excited to dive deeper into hooks tomorrow and see how they can simplify state management even further.</p>`
    },
    1: {
        title: "Breakthrough with Hooks",
        date: "March 5, 2025",
        preview: "Finally understanding useContext and useReducer properly after weeks of struggle...",
        content: `<h3>Breakthrough with Hooks</h3>
        <p><strong>March 5, 2025</strong></p>
        <p>Today I had a major breakthrough in my understanding of React's more advanced hooks. After struggling for weeks with complex state management, something finally clicked!</p>
        <p>I was working on a project that required shared state across many components, and I kept running into prop drilling issues. After revisiting the documentation and watching a few tutorials, I finally understood how useContext and useReducer can work together to create a global state management solution without reaching for external libraries.</p>
        <p>The pattern is surprisingly elegant:</p>
        <p>1. Create a context with useContext<br/>
        2. Define a reducer function to handle state updates<br/>
        3. Wrap your app with a provider component<br/>
        4. Access state and dispatch functions from any child component</p>
        <p>I refactored my entire application to use this pattern, and the code is now much cleaner and more maintainable. It's amazing how satisfying it is when a complex concept finally makes sense.</p>
        <p>I've created a CodePen demo to remember this pattern for future projects. Next up: exploring custom hooks!</p>`
    },
    2: {
        title: "Nature & Code Inspiration",
        date: "March 8, 2025",
        preview: "How nature walks help me solve coding problems and find creative inspiration...",
        content: `<h3>Nature & Code Inspiration</h3>
        <p><strong>March 8, 2025</strong></p>
        <p>I took a long hike in the mountains today, and as often happens, I found myself solving coding problems that had been stumping me all week.</p>
        <p>There's something about being in nature that allows my mind to work in the background on challenges. Without the pressure of staring at the screen, solutions often emerge naturally. The rhythm of walking, the fresh air, and the beauty of the natural world seem to unlock creative thinking in ways that sitting at a desk never can.</p>
        <p>During today's hike, I realized a much simpler approach to the animation sequence I've been struggling with. Instead of over-engineering with complex JavaScript, I can achieve a similar effect with CSS transitions.</p>`
    },
}