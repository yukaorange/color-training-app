import '@/app/privacypolicy/styles/privacy-policy.scss';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <>
      <div className="privacy-policy">
        <h1>プライバシーポリシー</h1>

        <section>
          <h2>1. はじめに</h2>
          <p>
            本プライバシーポリシーは、色彩トレーニングアプリケーション（以下、「本サービス」）におけるユーザーの個人情報の取り扱いについて説明します。
          </p>
        </section>

        <section>
          <h2>2. 収集する情報</h2>
          <p>本サービスでは、以下の情報を収集します：</p>
          <ul>
            <li>メールアドレス（ユーザー認証に使用）</li>
            <li>パスワード（暗号化して保存）</li>
            <li>色彩トレーニングで作成したアーカイブデータ</li>
          </ul>
        </section>

        <section>
          <h2>3. 情報の使用目的</h2>
          <p>収集した情報は、以下の目的で使用します：</p>
          <ul>
            <li>ユーザー認証とアカウント管理</li>
            <li>色彩トレーニングのアーカイブデータの保存と表示</li>
            <li>サービスの改善と新機能の開発</li>
          </ul>
        </section>

        <section>
          <h2>4. 情報の保護</h2>
          <p>
            ユーザーの個人情報を適切に保護するため、セキュリティ対策を実施しています。
            <br />
            ただし、インターネット上での完全な安全性を保証することはできません。
          </p>
        </section>

        <section>
          <h2>5. 第三者への情報提供</h2>
          <p>
            当社は、法令に基づく場合を除き、ユーザーの同意なく第三者に個人情報を提供することはありません。
          </p>
        </section>

        <section>
          <h2>6. Cookieの使用</h2>
          <p>本サービスでは、ユーザー認証とセッション管理のためにCookieを使用しています。</p>
        </section>

        <section>
          <h2>7. ユーザーの権利</h2>
          <p>
            ユーザーは、自身の個人情報へのアクセス、訂正、削除を要求する権利を有しています。これらの要求は、本サービス内の設定ページから行うことができます。
          </p>
        </section>

        <section>
          <h2>8. プライバシーポリシーの変更</h2>
          <p>
            当社は、必要に応じて本プライバシーポリシーを変更することがあります。重要な変更がある場合は、本サービス内で通知します。
          </p>
        </section>

        <section>
          <h2>9. お問い合わせ</h2>
          <p>本プライバシーポリシーに関するお問い合わせは、次の連絡先までお願いします：</p>
          <a href="https://x.com/home?lang=ja">Xアカウント</a>
        </section>

        <footer>
          <p>最終更新: 2024年10月</p>
        </footer>
      </div>
      <Link href="/" className="privacy-policy__back-to-top">
        戻る
      </Link>
    </>
  );
}
