import { RuleTester } from 'eslint';
import rule from '../../src/rules/no-dupe-v-else-if';

const ruleTester: RuleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2019, sourceType: 'module' },
});

ruleTester.run('no-dupe-v-else-if', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-if="foo")
div(v-else-if="bar")
div(v-else-if="baz")
</template>`,
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-if="foo")
  div(v-else-if="foo")
</template>`,
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-if="foo")
div(v-else-if="bar")
div(v-if="bar")
div(v-else-if="foo")
</template>`,
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-if="isSomething(x)")
div(v-else-if="isSomethingElse(x)")

div(v-if="a")
div(v-else-if="b")
div(v-else-if="c && d")
div(v-else-if="c && e")

div(v-if="n === 1")
div(v-else-if="n === 2")
div(v-else-if="n === 3")
div(v-else-if="n === 4")
div(v-else-if="n === 5")
</template>`,
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-if="foo")
div
div(v-else-if="foo")
</template>`,
    },
    // We don't care about this case (at this point)
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if)
    // div(v-else-if)
    // </template>`
    //     },

    // parse error
    // TODO: We currently don't inspect the condition itself
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="foo.")
    // div(v-else-if="foo.")
    // </template>`
    //     },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-else-if="foo.")
div(v-else-if="foo")
</template>`,
    },

    // Referred to the ESLint core rule.
    `<template lang="pug">
div(v-if="a")
div(v-else-if="b")
</template>`,
    `<template lang="pug">
div(v-if="a")
div(v-else-if="b")
div(v-else-if="c")
</template>`,
    `<template lang="pug">
div(v-if="true")
div(v-else-if="false")
</template>`,
    `<template lang="pug">
div(v-if="1")
div(v-else-if="2")
</template>`,
    `<template lang="pug">
div(v-if="f")
div(v-else-if="f()")
</template>`,
    `<template lang="pug">
div(v-if="f(a)")
div(v-else-if="g(a)")
</template>`,
    `<template lang="pug">
div(v-if="f(a)")
div(v-else-if="f(b)")
</template>`,
    `<template lang="pug">
div(v-if="a === 1")
div(v-else-if="a === 2")
</template>`,
    `<template lang="pug">
div(v-if="a === 1")
div(v-else-if="b === 1")
</template>`,
    `<template lang="pug">
div(v-if="a")
</template>`,
    `<template lang="pug">
div(v-if="a")
  div(v-if="a")
</template>`,
    `<template lang="pug">
div(v-if="a")
  div(v-if="b")
div(v-else-if="b")
</template>`,
    `<template lang="pug">
div(v-if="a")
  div(v-if="b")
    div(v-else-if="a")
</template>`,
    `<template lang="pug">
div(v-if="a")
div(v-else-if="!!a")
</template>`,
    `<template lang="pug">
div(v-if="a === 1")
div(v-else-if="a === (1)")
</template>`,
    `<template lang="pug">
div(v-if="a || b")
div(v-else-if="c || d")
</template>`,
    `<template lang="pug">
div(v-if="a || b")
div(v-else-if="a || c")
</template>`,
    `<template lang="pug">
div(v-if="a")
div(v-else-if="a || b")
</template>`,
    `<template lang="pug">
div(v-if="a")
div(v-else-if="b")
div(v-else-if="a || b || c")
</template>`,
    `<template lang="pug">
div(v-if="a && b")
div(v-else-if="a")
div(v-else-if="b")
</template>`,
    `<template lang="pug">
div(v-if="a && b")
div(v-else-if="b && c")
div(v-else-if="a && c")
</template>`,
    `<template lang="pug">
div(v-if="a && b")
div(v-else-if="b || c")
</template>`,
    `<template lang="pug">
div(v-if="a")
div(v-else-if="b && (a || c)")
</template>`,
    `<template lang="pug">
div(v-if="a")
div(v-else-if="b && (c || d && a)")
</template>`,
    `<template lang="pug">
div(v-if="a && b && c")
div(v-else-if="a && b && (c || d)")
</template>`,
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-if="foo")
div(v-else-if="foo")
</template>`,
      errors: [
        {
          message:
            'This branch can never execute. Its condition is a duplicate or covered by previous conditions in the `v-if` / `v-else-if` chain.',
          line: 3,
          column: 16,
          endLine: 3,
          endColumn: 19,
        },
      ],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-if="isSomething(x)")
div(v-else-if="isSomething(x)")
</template>`,
      errors: [
        {
          messageId: 'unexpected',
          line: 3,
        },
      ],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-if="a")
div(v-else-if="b")
div(v-else-if="c && d")
div(v-else-if="c && d")
</template>`,
      errors: [
        {
          messageId: 'unexpected',
          line: 5,
        },
      ],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-if="n === 1")
div(v-else-if="n === 2")
div(v-else-if="n === 3")
div(v-else-if="n === 2")
div(v-else-if="n === 5")
</template>`,
      errors: [
        {
          messageId: 'unexpected',
          line: 5,
        },
      ],
    },
    // TODO: We currently don't inspect the condition itself
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a || b")
    // div(v-else-if="a")
    // </template>`,
    //       errors: [
    //         {
    //           messageId: 'unexpected',
    //           line: 3
    //         }
    //       ]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a")
    // div(v-else-if="b")
    // div(v-else-if="a || b")
    // </template>`,
    //       errors: [
    //         {
    //           messageId: 'unexpected',
    //           line: 4
    //         }
    //       ]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a")
    // div(v-else-if="a && b")
    // </template>`,
    //       errors: [
    //         {
    //           messageId: 'unexpected',
    //           line: 3
    //         }
    //       ]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a && b")
    // div(v-else-if="a && b && c")
    // </template>`,
    //       errors: [
    //         {
    //           messageId: 'unexpected',
    //           line: 3
    //         }
    //       ]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a || b")
    // div(v-else-if="b && c")
    // </template>`,
    //       errors: [
    //         {
    //           messageId: 'unexpected',
    //           line: 3
    //         }
    //       ]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a")
    // div(v-else-if="b && c")
    // div(v-else-if="d && (c && e && b || a)")
    // </template>`,
    //       errors: [
    //         {
    //           messageId: 'unexpected',
    //           line: 4
    //         }
    //       ]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="foo")
    // div(v-else-if="foo && bar")
    // div(v-else-if="baz && foo")
    // </template>`,
    //       errors: [
    //         {
    //           messageId: 'unexpected',
    //           line: 3,
    //           column: 16,
    //           endLine: 3,
    //           endColumn: 19
    //         },
    //         {
    //           messageId: 'unexpected',
    //           line: 4,
    //           column: 23,
    //           endLine: 4,
    //           endColumn: 26
    //         }
    //       ]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a && b")
    // div(v-else-if="a && b && c")
    // div(v-else-if="a && c && b")
    // </template>`,
    //       errors: [
    //         { messageId: 'unexpected', line: 3 },
    //         { messageId: 'unexpected', line: 4 }
    //       ]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a || b")
    // div(v-else-if="a")
    // div(v-else-if="b")
    // </template>`,
    //       errors: [
    //         { messageId: 'unexpected', line: 3 },
    //         { messageId: 'unexpected', line: 4 }
    //       ]
    //     },
    {
      filename: 'foo.vue',
      code: `<template lang="pug">
div(v-if      ="((f && e) || d) && c || (b && a)")
div(v-else-if ="(a && b) || (c && (d || (e && f)))")
div(v-else-if ="(a && b) || (c && (d || (e && f)))")
</template>`,
      errors: [/*{ messageId: 'unexpected' }, */ { messageId: 'unexpected' }],
    },

    // Referred to the ESLint core rule.
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-if="a")
div(v-else-if="a")
</template>`,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-if="a")
div(v-else-if="b")
div(v-else-if="a")
div(v-else-if="c")
</template>`,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-if="a")
div(v-else-if="b")
div(v-else-if="a")
</template>`,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-if="a")
div(v-else-if="b")
div(v-else-if="c")
div(v-else-if="a")
</template>`,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-if="a")
div(v-else-if="b")
div(v-else-if="b")
</template>`,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-if="a")
div(v-else-if="b")
div(v-else-if="c")
div(v-else-if="b")
</template>`,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-if="a")
div(v-else-if="b")
div(v-else-if="c")
div(v-else-if="b")
div(v-else-if="d")
</template>`,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-if="a")
div(v-else-if="b")
div(v-else-if="c")
div(v-else-if="d")
div(v-else-if="b")
div(v-else-if="e")
</template>`,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-if="a")
div(v-else-if="a")
div(v-else-if="a")
</template>`,
      errors: [{ messageId: 'unexpected' }, { messageId: 'unexpected' }],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-if="a")
div(v-else-if="b")
div(v-else-if="a")
div(v-else-if="b")
div(v-else-if="a")
</template>`,
      errors: [
        { messageId: 'unexpected' },
        { messageId: 'unexpected' },
        { messageId: 'unexpected' },
      ],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-if="a")
  div(v-if="b")
div(v-else-if="a")
</template>`,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-if="a === 1")
div(v-else-if="a === 1")
</template>`,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-if="1 < a")
div(v-else-if="1 < a")
</template>`,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-if="true")
div(v-else-if="true")
</template>`,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-if="a && b")
div(v-else-if="a && b")
</template>`,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-if="a && b || c")
div(v-else-if="a && b || c")
</template>`,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-if="f(a)")
div(v-else-if="f(a)")
</template>`,
      errors: [{ messageId: 'unexpected' }],
    },
    // TODO: We currently don't inspect the condition itself
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a === 1")
    // div(v-else-if="a===1")
    // </template>`,
    //       errors: [{ messageId: 'unexpected' }]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a === 1")
    // div(v-else-if="a === /* comment */ 1")
    // </template>`,
    //       errors: [{ messageId: 'unexpected' }]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a || b")
    // div(v-else-if="a")
    // </template>`,
    //       errors: [{ messageId: 'unexpected' }]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a || b")
    // div(v-else-if="a")
    // div(v-else-if="b")
    // </template>`,
    //       errors: [{ messageId: 'unexpected' }, { messageId: 'unexpected' }]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a || b")
    // div(v-else-if="b || a")
    // </template>`,
    //       errors: [{ messageId: 'unexpected' }]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a")
    // div(v-else-if="b")
    // div(v-else-if="a || b")
    // </template>`,
    //       errors: [{ messageId: 'unexpected' }]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a || b")
    // div(v-else-if="c || d")
    // div(v-else-if="a || d")
    // </template>`,
    //       errors: [{ messageId: 'unexpected' }]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="(a === b && fn(c)) || d")
    // div(v-else-if="fn(c) && a === b")
    // </template>`,
    //       errors: [{ messageId: 'unexpected' }]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a")
    // div(v-else-if="a && b")
    // </template>`,
    //       errors: [{ messageId: 'unexpected' }]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a && b")
    // div(v-else-if="a && b && c")
    // </template>`,
    //       errors: [{ messageId: 'unexpected' }]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a || c")
    // div(v-else-if="a && b || c")
    // </template>`,
    //       errors: [{ messageId: 'unexpected' }]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a")
    // div(v-else-if="b")
    // div(v-else-if="c && a || b")
    // </template>`,
    //       errors: [{ messageId: 'unexpected' }]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a")
    // div(v-else-if="b")
    // div(v-else-if="c && (a || b)")
    // </template>`,
    //       errors: [{ messageId: 'unexpected' }]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a")
    // div(v-else-if="b && c")
    // div(v-else-if="d && (a || e && c && b)")
    // </template>`,
    //       errors: [{ messageId: 'unexpected' }]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a || b && c")
    // div(v-else-if="b && c && d")
    // </template>`,
    //       errors: [{ messageId: 'unexpected' }]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a || b")
    // div(v-else-if="b && c")
    // </template>`,
    //       errors: [{ messageId: 'unexpected' }]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a")
    // div(v-else-if="b")
    // div(v-else-if="(a || b) && c")
    // </template>`,
    //       errors: [{ messageId: 'unexpected' }]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="(a && (b || c)) || d")
    // div(v-else-if="(c || b) && e && a")
    // </template>`,
    //       errors: [{ messageId: 'unexpected' }]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a && b || b && c")
    // div(v-else-if="a && b && c")
    // </template>`,
    //       errors: [{ messageId: 'unexpected' }]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a")
    // div(v-else-if="b && c")
    // div(v-else-if="d && (c && e && b || a)")
    // </template>`,
    //       errors: [{ messageId: 'unexpected' }]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a || (b && (c || d))")
    // div(v-else-if="(d || c) && b")
    // </template>`,
    //       errors: [{ messageId: 'unexpected' }]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a || b")
    // div(v-else-if="(b || a) && c")
    // </template>`,
    //       errors: [{ messageId: 'unexpected' }]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a || b")
    // div(v-else-if="c")
    // div(v-else-if="d")
    // div(v-else-if="b && (a || c)")
    // </template>`,
    //       errors: [{ messageId: 'unexpected' }]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a || b || c")
    // div(v-else-if="a || (b && d) || (c && e)")
    // </template>`,
    //       errors: [{ messageId: 'unexpected' }]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a || (b || c)")
    // div(v-else-if="a || (b && c)")
    // </template>`,
    //       errors: [{ messageId: 'unexpected' }]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a || b")
    // div(v-else-if="c")
    // div(v-else-if="d")
    // div(v-else-if="(a || c) && (b || d)")
    // </template>`,
    //       errors: [{ messageId: 'unexpected' }]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a")
    // div(v-else-if="b")
    // div(v-else-if="c && (a || d && b)")
    // </template>`,
    //       errors: [{ messageId: 'unexpected' }]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a")
    // div(v-else-if="a || a")
    // </template>`,
    //       errors: [{ messageId: 'unexpected' }]
    //     },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-if="a || a")
div(v-else-if="a || a")
</template>`,
      errors: [{ messageId: 'unexpected' }],
    },
    // TODO: We currently don't inspect the condition itself
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a || a")
    // div(v-else-if="a")
    // </template>`,
    //       errors: [{ messageId: 'unexpected' }]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a")
    // div(v-else-if="a && a")
    // </template>`,
    //       errors: [{ messageId: 'unexpected' }]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a && a")
    // div(v-else-if="a && a")
    // </template>`,
    //       errors: [{ messageId: 'unexpected' }]
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-if="a && a")
    // div(v-else-if="a")
    // </template>`,
    //       errors: [{ messageId: 'unexpected' }]
    //     }
  ],
});
