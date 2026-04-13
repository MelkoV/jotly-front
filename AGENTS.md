# AGENTS

## List Item Fields By Type

Common fields for every `list_item`:
- `name` — required
- `description` — optional

Additional fields for `type == "todo"`:
- `priority` — optional, enum: `low`, `medium`, `high`
- `deadline` — optional, `date`

Additional fields for `type == "shopping"`:
- `unit` — optional, enum: `thing`, `package`, `kg`
- `price` — optional, `float`
- `cost` — optional, `float`
- `count` — optional, `float`

Validation rule:
- only `name` is required for all types
- every other field is optional
