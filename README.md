# BlockEditorOriginalFields

Movable Type 7のコンテンツタイプで利用できるBlockEditorに独自フィールドを追加するプラグインのサンプルです。

## 補足・制約事項

- MT7 Beta1を使用して開発しました。
- `/path/to/mt`の下に`mt-static`がある前提になっています。（改良に向けフィードバックを提出済み）
    - `plugins/BlockEditorOriginalFields/config.yaml`内の`path`を修正することで変更可能です。
- IE11には対応していません。（image_and_text.jsを[Babel](https://babeljs.io/)でトランスパイルすると利用可能になります。）
