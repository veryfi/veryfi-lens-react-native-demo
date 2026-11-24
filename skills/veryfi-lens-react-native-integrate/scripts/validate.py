#!/usr/bin/env python3
"""Validate the React Native Lens skill pack. Stdlib only."""

from __future__ import annotations

import re
import sys
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parent.parent
LINK_RE = re.compile(r"\[[^\]]*]\(([^)]+)\)")
FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---", re.DOTALL)
FENCE_RE = re.compile(r"```(\w+)?\n(.*?)```", re.DOTALL)

REQUIRED = [
    "SKILL.md",
    "install.md",
    "implementation.md",
    "recipes.md",
    "settings-groups.md",
    "settings-catalog.md",
    "conflicts.md",
    "clarifications.md",
    "troubleshooting.md",
    "suggestions.md",
    "checklist.md",
    "parity.md",
    "sources.md",
    "templates/full.md",
    "templates/receipts.md",
    "templates/long-receipts.md",
    "templates/checks.md",
    "templates/credit-cards.md",
    "templates/business-cards.md",
    "templates/barcodes.md",
    "templates/ocr-code-strips.md",
    "templates/ocr-code-caps.md",
    "templates/w2.md",
    "templates/w9.md",
    "templates/any-documents.md",
]

PHRASES = [
    "configureWithCredentials",
    "NativeEventEmitter",
    "VeryfiLens.NativeModule",
    "VeryfiLens.Events",
    "hasListeners",
    "retryPackage",
    "showInfoButton",
    "VeryfiInfoView",
    "newArchEnabled",
    "Unconfirmed",
    "Headless",
    "Lite",
    "Remote Models",
    "userName",
    "getFileBase64",
    "onHelpButtonClicked",
    "showHelpScreen",
    "setInfoView",
    "closeCamera",
    "veryfi-lens-sdk",
    "2.7.0.4",
    "2.0.62",
    "d57624ab75654fbd026cf301197b83c0822c82a2",
    "backupDocsToGallery",
    "ignoreRemoteSettings",
    "dataExtractionEngine",
    "credit_card",
    "retrieveCheckTiffIsOn",
    "sdk_binary_sizes",
    "unsupported",
    "quick",
    "guided",
    "fraudDetectionIsOn",
    "documentFieldsToDetect",
    "imageSourceTag",
    "src/index.tsx",
    "index.d.ts",
]

SIBLING = re.compile(
    r"veryfi-lens-(ios|android|plugins|capacitor|flutter|cordova|maui)-integrate"
)


def fail(errors: list[str], message: str) -> None:
    errors.append(message)


def markdown_files() -> list[Path]:
    return sorted(ROOT.rglob("*.md"))


def check_frontmatter(errors: list[str]) -> None:
    text = (ROOT / "SKILL.md").read_text(encoding="utf-8")
    match = FRONTMATTER_RE.match(text)
    if not match:
        fail(errors, "SKILL.md is missing YAML frontmatter")
        return
    body = match.group(1)
    name = re.search(r"^name:\s*(\S+)\s*$", body, re.M)
    desc = re.search(r"^description:\s*>-\s*\n((?:  .+\n)+)", body, re.M)
    if not name or name.group(1) != "veryfi-lens-react-native-integrate":
        fail(errors, "SKILL.md name must be veryfi-lens-react-native-integrate")
    if not desc:
        fail(errors, "SKILL.md description must use a folded block")
    else:
        description = " ".join(line.strip() for line in desc.group(1).splitlines())
        if not description:
            fail(errors, "SKILL.md description is empty")
        if len(description) > 1024:
            fail(errors, "SKILL.md description exceeds 1024 characters")
        if description.startswith(("I ", "You ")):
            fail(errors, "SKILL.md description must be third person")
    line_count = text.count("\n") + (0 if text.endswith("\n") else 1)
    if line_count > 500:
        fail(errors, f"SKILL.md is {line_count} lines; keep it at or under 500")


def check_links(errors: list[str]) -> None:
    for source in markdown_files():
        text = source.read_text(encoding="utf-8")
        if SIBLING.search(text):
            fail(errors, f"{source.relative_to(ROOT)}: links another Lens skill pack")
        for raw in LINK_RE.findall(text):
            target = raw.strip().split()[0].strip("<>")
            if target.startswith(("http://", "https://", "mailto:", "#")):
                continue
            path_part = unquote(target.split("#", 1)[0])
            if not path_part:
                continue
            resolved = (source.parent / path_part).resolve()
            if not resolved.exists():
                fail(errors, f"{source.relative_to(ROOT)}: missing link {target}")
            elif ROOT.resolve() not in resolved.parents and resolved != ROOT.resolve():
                fail(errors, f"{source.relative_to(ROOT)}: link leaves this skill: {target}")


def check_phrases(errors: list[str]) -> None:
    blob = "\n".join(path.read_text(encoding="utf-8") for path in markdown_files())
    for phrase in PHRASES:
        if phrase not in blob:
            fail(errors, f"missing required phrase: {phrase}")
    if '"custom"' in blob and "do not" not in blob.lower() and "Do not" not in blob:
        fail(errors, "custom engine mentioned without a refusal")
    engines = set(re.findall(r'dataExtractionEngine:\s*[\'"]([^\'"]+)[\'"]', blob))
    engines |= set(re.findall(r'"dataExtractionEngine"\s*:\s*"([^"]+)"', blob))
    if not engines <= {"api", "mobile", "none"}:
        fail(errors, f"unsupported engine strings: {engines - {'api', 'mobile', 'none'}}")
    if "headlessUpload" not in blob:
        fail(errors, "missing headlessUpload (must be named as unsupported)")
    if "uploadImages" not in blob:
        fail(errors, "missing uploadImages (must be named as unbridged)")


def check_source_tokens(errors: list[str]) -> None:
    index = Path(
        "/Users/veryfij/plugins/veryfi-lens-react-plugin/react-native-veryfi-lens/src/index.tsx"
    )
    if not index.is_file():
        print(f"note: React Native source absent at {index}")
        return
    text = index.read_text(encoding="utf-8")
    for token in (
        "configureWithCredentials",
        "showGallery",
        "showDocumentBrowser",
        "closeCamera",
        "showHelpScreen",
        "getFileBase64",
    ):
        if token not in text:
            fail(errors, f"pinned src/index.tsx missing {token}")
    kotlin = Path(
        "/Users/veryfij/plugins/veryfi-lens-react-plugin/react-native-veryfi-lens/android/src/main/java/com/reactnativeveryfilens/VeryfiLensModule.kt"
    )
    if kotlin.is_file() and "fun retryPackage(packageID: String)" not in kotlin.read_text(
        encoding="utf-8"
    ):
        fail(errors, "Android retryPackage signature changed; update the skill")


def main() -> int:
    errors: list[str] = []
    for name in REQUIRED:
        if not (ROOT / name).is_file():
            fail(errors, f"missing {name}")
    if not errors:
        check_frontmatter(errors)
        check_links(errors)
        check_phrases(errors)
        check_source_tokens(errors)
    if errors:
        print("FAIL")
        for item in errors:
            print(f"- {item}")
        return 1
    print(f"OK: {len(markdown_files())} Markdown files")
    return 0


if __name__ == "__main__":
    sys.exit(main())
